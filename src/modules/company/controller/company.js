import slugify from 'slugify';
import cloudinary from '../../../utlis/cloudinary.js'
import CompanyModel from '../../../../DB/model/company.model.js'
import { asyncHandler } from '../../../utlis/errorHandling.js'
import mongoose from 'mongoose';




export const CompanyCreate = asyncHandler (async (req,res,next) =>{

    const {name} = req.body;
    
    if (await CompanyModel.findOne({ name })) {
        return next(new Error(`Duplicate Company name ${name}`, { cause: 400}))
    }

    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/Company`})
    const slug =slugify(name, '-');
    const image =  {secure_url , public_id};
    const Company = await CompanyModel.create(
       {name , slug , image , UserId :req.user.id}
    )
    if (!Company){
        await cloudinary.uploader.destroy(public_id);
        return next(new Error('Error while creating the Company'),{cause : 400} )
    }
    return res.status(200).json({ message: 'Done', Company})
})


export const GetAllCompany = asyncHandler(async(req , res,next)=>{
    const Company = await CompanyModel.find();
    res.status (200).json(Company)
})


export const CompanyUpdate = asyncHandler(async(req,res,next)=>{
  if(Object.keys(req.body).length == 0 && !req.file){
    return next(new Error('There is no data sent'),{cause:300})
  }
  
  const {_id} = req.user;
  const {name} = req.body;
  const newCompanyNameCheck = await CompanyModel.findOne({name});

  if(newCompanyNameCheck){
    return next(new Error('The new Company name is already in use'),{cause:400});
  }
  if(!mongoose.Types.ObjectId.isValid(req.params.companyid)){
    return next(new Error('Please Enter Valid Company Id'),{cause:400});
  }

  const CompanyCheck = await CompanyModel.findOne({_id: req.params.companyid, createdBy: _id});
  if(!CompanyCheck){
    return next(new Error('Please Enter Valid Company Id'),{cause:400});
  }

  if(req.file){
    const OldPublic = CompanyCheck.image.public_id;
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.APP_NAME}/Company`});
    CompanyCheck.image.public_id = public_id;
    CompanyCheck.image.secure_url = secure_url;
    await CompanyCheck.save();
    await cloudinary.uploader.destroy(OldPublic);
  }

  CompanyCheck.name = name;
  CompanyCheck.updatedBy = _id;

  await CompanyCheck.save();
  res.status(201).json(CompanyCheck);
})
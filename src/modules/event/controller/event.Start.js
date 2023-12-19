import { mongoose } from 'mongoose'
import CategoryModel from '../../../../DB/model/category.model.js'
import { asyncHandler } from '../../../utlis/errorHandling.js'
import CompanyModel from '../../../../DB/model/company.model.js'
import slugify from 'slugify'
import cloudinary from '../../../utlis/cloudinary.js'
import EventModel from '../../../../DB/model/event.model.js'


export const Create = asyncHandler(async(req,res,next)=>{
    const {title , price , discount , location , date , description , stock} = req.body;
    const {categoryId , companyId} = req.query;
    const {_id} = req.user

    const anEvent = await EventModel.findOne({companyId,title});
    if(anEvent){
        return next(new Error('the Event duplicated name'));
    }

    const findcategory = await CategoryModel.findById(categoryId);
    if(!mongoose.Types.ObjectId.isValid(categoryId)||!findcategory){
        return next(new Error('In-Valid Category Id', {cause:400}));
    }

    const company = await CompanyModel.findById(companyId);
    if(!mongoose.Types.ObjectId.isValid(companyId)||!company){
        return next(new Error('In-Valid Company Id',{cause:400}));
    }

    var id = new mongoose.Types.ObjectId();
    const slug = slugify(title,'-');
    const priceAtfterDiscount = price - (price * ((discount || 0) / 100));
    if(!req.files){
        return next(new Error('Upload Pictures Please',{cause:400}));
    }
    const images =[];
    const publics =[];
    for(const file of req.files){
        const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.APP_NAME}/Company/${companyId}/Event/${id}`});
        images.push({secure_url,public_id});
        publics.push(public_id);
    }
    req.ImagePath = `${process.env.APP_NAME}/Company/${companyId}/Event/${id}`
    const TheEvent = await EventModel.create({_id : id,title,price,discount,location,date,description,stock,images,categoryId,companyId,slug,priceAtfterDiscount,createdBy:_id})

    if(!TheEvent){

        await cloudinary.api.delete_resources(publics);
        await cloudinary.api.delete_folder(req.ImagePath);

    }
    res.status(201).json({Message:'Done',TheEvent});
})
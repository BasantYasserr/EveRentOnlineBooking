import slugify from 'slugify';
import cloudinary from '../../../utlis/cloudinary.js'
import CategoryModel from '../../../../DB/model/category.model.js'
import { asyncHandler } from '../../../utlis/errorHandling.js'



export const createCategory = asyncHandler (async (req,res,next) =>{

    const {name} = req.body;
    
    if (await CategoryModel.findOne({ name })) {
        return next(new Error(`Duplicate category name ${name}`, { cause: 400}))
    }
    var image={};
    if(req.file){
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category`})
     image =  {secure_url , public_id};
    }

    const slug =slugify(name, '-');
    const category = await CategoryModel.create(
       {name , slug , image , UserId :req.user.id}
    )
    if (!category){
        await cloudinary.uploader.destroy(public_id);
        return next(new Error('Error while creating the category'),{cause : 400} )
    }
    return res.status(200).json({ message: 'Done', category})
})


export const getCategory = asyncHandler (async (req,res,next) =>{
    const {id} = req.query;
    const category = await CategoryModel.findById(id).populate([
        {
            path : 'eventss'
        }
    ])
    return res.json(category)
})


export const GetAllCategory = asyncHandler(async(req , res,next)=>{
    const Category = await CategoryModel.find().populate([
        {
            path : 'eventss'
        }
    ])
    return res.json(Category)
})
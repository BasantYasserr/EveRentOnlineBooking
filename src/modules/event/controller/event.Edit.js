import { mongoose } from 'mongoose'
import CategoryModel from '../../../../DB/model/category.model.js'
import { asyncHandler } from '../../../utlis/errorHandling.js'
import CompanyModel from '../../../../DB/model/company.model.js'
import slugify from 'slugify'
import cloudinary from '../../../utlis/cloudinary.js'
import EventModel from '../../../../DB/model/event.model.js'


export const Update = asyncHandler(async (req,res,next)=>{
    const {title , price , discount , location , date , description , stock} = req.body;
    const {eventId , categoryId , companyId} = req.query;
    
    const event = await EventModel.findById(eventId);
    if(!event){
        return next(new Error('The Event does not exists'));
    }
    let findcategory;
    if(categoryId){
        findcategory = await CategoryModel.findById(categoryId);
        if(!mongoose.Types.ObjectId.isValid(categoryId)||!findcategory){
            return next(new Error('In-Valid Category Id',{cause:400}));
        }
    }

    const company = await CompanyModel.findById(companyId);
    if(!mongoose.Types.ObjectId.isValid(companyId)||!company){
        return next(new Error('In-Vald Company Id',{cause:400}));
    }

    if(discount && price){
        event.priceAtfterDiscount = price * (1- ((discount||0) /100));
    }else if(price){
        event.priceAtfterDiscount = price * (1- ((event.discount||0) /100));
    }else if (discount){
        event.priceAtfterDiscount = event.price * (1- ((discount||0) /100));
    }

    var images = [];
    if(title && req.files?.length){
        const slug = slugify(title,'-');
        if(event.images?.length>0){
            for(const image of event.images){
                await cloudinary.api.delete_resources(image.public_id);
            }
        }
        event.title=title;
        event.slug=slug;
        event.images.length=0;
        const images = [];
        for(const file of req.files){
            const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.APP_NAME}/Company/${companyId}/Event/${event.id}`});
            images.push({secure_url , public_id});
        }
        event.images=images;
    }else if(req.files?.length){
        if(event.images.length>0){
            for(const image of event.images){
                await cloudinary.api.delete_all_resources(image.public_id);
            }
            await cloudinary.api.delete_folder(`${process.env.APP_NAME}/Company/${companyId}/Event/${event.slug}`);
        }
        event.images.length = 0 ;
        for(const file of req.files){
            const {secure_url , public_id} = await cloudinary.uploader.upload(file.path,{folder :`${process.env.APP_NAME}/Company/${companyId}/Event/${event.slug}`});
            event.images.push({secure_url,public_id});
        }
    }else if(title){
        const slug = slugify(title,'-');
        event.title = title;
        event.slug = slug;
    }

    if(location){event.location = location}
    if(date){event.date = date}
    if(description){event.description = description}
    if(stock && stock > 0){event.stock = stock;}

    req.body.updatedBy = req.user._id
    await event.save();
    res.status(201).json(event);
})
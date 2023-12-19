import mongoose  from "mongoose";
import CouponModel from '../../../../DB/model/coupon.model.js'
import cloudinary from "../../../utlis/cloudinary.js";
import { asyncHandler } from "../../../utlis/errorHandling.js";
import CategoryModel from '../../../../DB/model/category.model.js'
import UserModel from '../../../../DB/model/User.model.js'


export const CouponCreate = asyncHandler(async (req,res,next)=>{
    const name = req.body.name.toLowerCase();
    const {categoryId} = req.query;

    if(!mongoose.Types.ObjectId.isValid(req.user._id) || !await UserModel.findById(req.user._id)){
        return next(new Error('The Creator Id is in-valid'),{cause : 400});
    }
    if(await CouponModel.findOne({name})){
        return next(new Error('Duplicated Coupon name'),{cause : 400});
    }
    if(!mongoose.Types.ObjectId.isValid(categoryId) || !await CategoryModel.findById(categoryId)){
        return next(new Error('In-Valid Category Id'),{cause : 400});
    }
    var now = Date.parse(new Date());
    const exp = Date.parse(req.body.expireDate);
    if(now > exp){
        return next (new Error('The Date is Expired'))
    }
    if(req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder : `${process.env.APP_NAME}/Coupons`});
        req.body.image = {secure_url , public_id}
    }

    req.body.addedBy=req.user._id;
    req.body.categoryId=categoryId;

    const Coupon = await CouponModel.create(req.body);
    res.status(201).json({ Coupon , Message : 'Done'});
})


export const getCoupon = asyncHandler (async (req,res,next) =>{
    const {id} = req.query;
    const coupon = await CouponModel.findById(id)
    return res.status(200).json(coupon)
})


export const CouponUpdate = asyncHandler(async(req,res,next)=>{
    if(Object.keys(req.body).length == 0 && !req.file){
        return next(new Error ('There is no data sent'), {cause : 300})
    }
    
    const {CouponId} = req.params;
    const TheCoupon = await CouponModel.findById(CuponId) 
    if(!mongoose.Types.ObjectId.isValid(CouponId) || !TheCoupon){
        return next (new Error('The CouponID isn`t valid'),{cause : 400});
    }
    
    const CouponUpdate = await CouponModel.findById(CouponId);
    if(req.body.name){
        if(req.body.name == CouponUpdate.name){ return next(new Error('Cannot Update to same Name'))}

        const findCoupon = await CategoryModel.findOne({name : req.body.name})
        if(findCoupon){ return next(new Error(`Coupon Name Duplicated`),{cause : 400})}
        CouponUpdate.name = req.body.name;
    }

    if(req.body.expireDate){
        CouponUpdate.expireDate = req.body.expireDate;
    }
    if(req.body.amount){
        CouponUpdate.amount = req.body.amount;
    }

    if(req.file){
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path,{folder: `${process.env.APP_NAME}/Coupons`});
        if(Object.keys(CouponUpdate.image).length == 0){
            await cloudinary.uploader.destroy(CouponUpdate.image.public_id);
        }
        CouponUpdate.image = {secure_url,public_id}
    }

    await CouponUpdate.save();
    res.status(200).json({ Message : 'Done', CouponUpdate})
})

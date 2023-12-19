import Joi from "joi";

export const CouponCreate = Joi.object({
    name : Joi.string().min(3).required(),
    amount : Joi.number().positive().min(2).required(),
    expireDate: Joi.date().required()
}).required()


export const CouponUpdate = Joi.object({
    name : Joi.string().min(3),
    amount : Joi.number().positive().min(1).max(100),
    expireDate: Joi.date()
}).required()



export const CouponDelete = Joi.object({
}).required();




export const CouponAllSearch = Joi.object({
}).required();
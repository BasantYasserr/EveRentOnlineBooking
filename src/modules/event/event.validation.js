import Joi from "joi";


export const EventCreate = Joi.object({

    title : Joi.string().min(10).max(150).required(),
    description : Joi.string().min(10).max(1500000),
    location : Joi.string().min(20).max(10000).required(),
    date : Joi.string().required(),
    price : Joi.number().positive().min(1).required(),
    discount : Joi.number().positive().min(1),

    categoryId :  Joi.string().required(),
    companyId :  Joi.string().required()
    
}).required()

export const EventUpdate = Joi.object({

    title : Joi.string().min(10).max(150).required(),
    description : Joi.string().min(10).max(1500000),
    location : Joi.string().min(20).max(10000).optional(),
    date : Joi.string().optional(),
    price : Joi.number().positive().min(1).optional(),
    discount : Joi.number().positive().min(1),

    categoryId :  Joi.string().required(),
    companyId :  Joi.string().required()
    
})
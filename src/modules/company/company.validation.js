import Joi from "joi";

export const companyCreate = Joi.object({
    name : Joi.string().min(3).required()
}).required()


export const companyUpdate = Joi.object({
    name : Joi.string().min(3).optional(),}).required()



export const companyDelete = Joi.object({
    name : Joi.string().min(3).required()
}).required();




export const companyAllSearch = Joi.object({
}).required();
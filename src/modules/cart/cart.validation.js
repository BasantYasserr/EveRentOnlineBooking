import joi from 'joi'



const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}


export const cart = joi.object({
    eventId : joi.string().custom(isValidObjectID).required(),
    quantity : joi.number().integer().min(1).required()
}).required();


export const removeEventfromCart = joi.object({
    eventId : joi.string().custom(isValidObjectID).required(),
}).required();

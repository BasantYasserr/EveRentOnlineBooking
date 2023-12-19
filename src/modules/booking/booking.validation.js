import Joi from "joi"

const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}

export const CreateBooking = Joi.object({
    copoun : Joi.string().length(5),
    payment : Joi.string().valid("visa").required()
}).required();

export const CancelBooking = Joi.object({
    bookingId : Joi.string().custom(isValidObjectID).required(),
}).required()
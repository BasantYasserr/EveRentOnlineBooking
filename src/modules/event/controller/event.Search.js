import  EventModel  from '../../../../DB/model/event.model.js'
import { Apifeatures } from '../../../utlis/ApiFeatures.js'
import { asyncHandler } from '../../../utlis/errorHandling.js'
import { pagination } from '../../../utlis/pagination.js'

export const allEvents = asyncHandler(async(req,res,next)=>{
    
    const apifeatures = new Apifeatures(EventModel.find(),req.query).pagination().filter().sort();
    const events = await apifeatures.mongooseQuery
    res.status(200).json(events)
})

export const eventsbytitle = asyncHandler(async(req,res,next)=>{

    const {eventtitle, size, page} = req.query;
    const {limit, skip} = pagination({page,size})
    const events = await EventModel.find({$or :[{ title : { $regex :  eventtitle , $options : 'i'} },{ desc : { $regex :  eventtitle ,$options:'i'}}]}).limit(limit).skip(skip);

    res.status(200).json(events);
})
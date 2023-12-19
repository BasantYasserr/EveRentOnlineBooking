import CartModel from '../../../../DB/model/cart.model.js'
import EventModel from '../../../../DB/model/event.model.js'
import { asyncHandler } from '../../../utlis/errorHandling.js'


export const CartCreate = asyncHandler(async(req,res,next)=>{
    const { eventId, quantity} = req.body;
    
    //Check Event Availability
    const event = await EventModel.findById(eventId);
    if(!event) return next(new Error("The Event not found!",{cause:404}))
    if(!event.inStock(quantity) || event.isDeleted) return next(new Error("Available Tickets limit exceeded!",{cause:400}))

    //check cart exist
    const isEventInCart = await CartModel.findOne({
        user : req.user._id,
        'events.eventId': eventId
    });
    //if not create new one
    if(!isEventInCart){
        const newCart = await CartModel.create({
            userId : req.user._id,
            events : [{eventId, quantity}]
        }) 
    }
    if(isEventInCart){
        isEventInCart.events.forEach((eventObj)=>{
            if(eventObj.eventId.toString() === eventId.toString() &&
               eventObj.quantity + quantity < event.availabletickets)
            {
                eventObj.quantity = eventObj.quantity + quantity
            }
            if(eventObj.quantity + quantity > event.availabletickets){
                return next(new Error("Available Tickets limit exceeded!"))
            }
        })
        await isEventInCart.save();
        const cart = CartModel.find({user : req.user._id})
        return res.json({success : true, msg : "ticket added to cart successfully" , results : cart})
    } else {
        const cart = await CartModel.findOneAndUpdate(
            { user : req.user._id },
            { $push : { events : { eventId,quantity } } },
            { new : true }
        );
        return res.json({success : true, msg : "Ticket added to cart successfully" , results : cart})
    }
});

export const UserCart = asyncHandler(async(req,res,next)=>{
    const cart = await CartModel.findOne({user : req.user._id}).populate({
        path :'events.eventId',
        select : 'title price discount finalPrice image.url'
    });
    return res.json({success:true, result:cart})
})

export const CartUpdate = asyncHandler(async(req,res,next)=>{
    const {eventId , quantity} = req.body;

    const event = await EventModel.findById(eventId);
    if(!event) return next(new Error("Event Not Found!",{cause:404}))

    if(event.inStock(quantity)){
        return next(new Error("Available Tickets Limit exceeded!",{cause:400}))
    }

    const cart = await CartModel.findOneAndUpdate(
        {user : req.user._id, 'events.eventsId': eventId},
        {$set : {"events.$.quantity" : quantity} },
        { new : true }
    )

    return res.json({success:true, result:cart})
});

export const removeEventfromCart = asyncHandler(async(req,res,next)=>{
    const cart = await CartModel.findOneAndUpdate(
        {user : req.user._id},
        {$pull : { events : {eventId: req.params.eventId} } },
        { new : true }
    );
    return res.json({success:true, msg:"event removed successfully!", results: cart})
})

export const CartClear = asyncHandler(async(req,res,next)=>{
    const cart = await CartModel.findOneAndUpdate(
        {user:req.user._id},
        {events:[]},
        {new : true}
    )
    return res.json({success:true, msg:"Cart Clearfied Successfuly", results:cart})
})
import { asyncHandler } from "../../../utlis/errorHandling.js";
import CartModel from '../../../../DB/model/cart.model.js'
import CouponModel from '../../../../DB/model/coupon.model.js'
import EventModel from '../../../../DB/model/event.model.js'
import BookingModel from '../../../../DB/model/booking.model.js'
import { updateSock } from "../booking.services.js";
import cloudinary from "../../../utlis/cloudinary.js";
import sendEmail from '../../../utlis/Mailer.js'
import payment from "../../../utlis/payment.js";
import Stripe from "stripe";
// import { date } from "joi";




export const CreateBooking = asyncHandler(async(req,res,next)=>{
    const { payments, coupon } = req.body;

    const cart = await CartModel.findOne({user : req.user._id});
    const events = cart.events;
    if (events.length < 1) return next(new Error("Empty cart!"));

    if(coupon){
        const coupon = await CouponModel.findOne({name: coupon.toLowerCase(), usedBy: { $nin: req.user._id}})
        if(!coupon || coupon.expireDate.getTime() < Date.now()){
            return next(new Error('In-Valid Coupon',{cause:400}))
        }
        req.body.coupon = coupon
    }
    
    const bookingEventTickets = [];
    let bookingPrice = 0;
    const EventIds = []
    for(let event of events){
        const checkedEvent = await EventModel.findOne({
            _id: event.eventId,
            stock: { $gte: event.eventId}
        })
        if(!checkedEvent) return next(new Error(`In-Valid Event ${checkedEvent.title}`,{cause:400}))
        events = event.toObject()
        EventIds.push(event.eventId);
        bookingEventTickets.push({
            eventId : checkedEvent._id,
            name : checkedEvent.title,
            ticketPrice : checkedEvent.ticketPrice,
            totalPrice :event.quantity * checkedEvent.totalPrice.toFixed(2) 
        })
        bookingPrice +=  event.quantity * checkedEvent.totalPrice;
    }
    const booking = await BookingModel.create({
        userId : req.user._id,
        events : bookingEventTickets,
        copoun : {
            id : coupon?._id,
            code : coupon?.name,
            discount : coupon?.discount
        },
        bookingPrice,
        price : bookingPrice - (bookingPrice *((req.body.coupon?.amount || 0) / 100)).toFixed(2),
        payments,
        status : 'waitPayment'
    })

    //decrease event stock
    for (const event of events) { await EventModel.updateOne({_id: event.eventId},{$inc: {stock: -parseInt(event.quantity)}})}

    // //clear cart tickets
    // await CartModel.updateOne({userId:req.user._id},{
    //     $pull: {
    //         events: {
    //             eventId: {$in:EventIds}
    //         }
    //     }
    // })
    
    //await CartModel.updateOne({userId:req.user._id},{events: [] })

    //Payment
    if((booking.paymentType == 'card')||(booking.paymentType == 'paypal')){
        const stripe = new Stripe(process.env.STRIPE_KEY)
        if(req.body.coupon){
            const coupon = await stripe.coupons.create({ percent_off:req.body.coupon.amount })

            req.body.couponId = coupon.id
        }
        const session = await payment({
            stripe,
            payment_method_types : ['card','paypal'],
            mode: 'payment',
            customer_email: req.user.email,
            metadata:{
                bookingId: booking._id.toString()
            },
            cancel_url: `${process.env.CANCEL_URL}?bookingId=${booking._id.toString()}`,
            line_items: booking.events.map(event => {
                return {
                    price_data:{
                        currency: 'usd',
                        product_data: {
                            name: event.title
                        },
                        unit_amount: event.unitPrice*100  //convert from cent to dollar
                    },
                    quantity: event.quantity
                }
            }),
            discounts: req.body.couponId ? [{ coupon: req.body.couponId}] : []
        })
        
    return res.status(201).json({booking, session, url:session.url})
    }

    return res.status(201).json({booking})
})

export const cancelBooking = asyncHandler(async(req,res,next)=>{
    const {bookingId} = req.params;
    const booking = await BookingModel.findById(bookingId);
    if (!booking) return next(new Error("booking not found" , {cause : 404}));
    if((!booking?.status != "placed") || (!booking?.status != "waitPayment")) {
        return next(new Error("Cannot Cancel Booking After Payment ",{cause:400}))
    }
    booking.status = "canceled"
    await booking.save();
    updateSock(booking.events, false);
    return res.json({success:true, msg:"booking canceled successfully",})
})
import mongoose,{ Schema, Types } from "mongoose";

const BookingSchema = new Schema ({
    events : [
        {
            eventId: {type: Types.ObjectId , ref : "Event"},
            _id : false,
            quantity : { type : Number, min:1, max:5},
            name : String,
            ticketPrice : Number,
            totalPrice : Number
        }
    ],
    userId : {
        type : String,
        ref : "User",
        required : true
    },
    invoice : {id: String, url : String},
    price : {type : Number, required:true},
    status : {
        type : String,
        enum : ['placed','waitPayment','confirmed','canceled','failed to pay'],
        default : 'placed'
    },

    coupon : {
        id : {type : Types.ObjectId, ref: 'Coupon'},
        discount : {type : Number, min:1 , max:100},
        code : {type : String}
    },
    paymentType : {
        type : String,
        enum : ["card","paypal"],
        default : 'card'
    }

}, {
    timestamps:true,
    toJSON : {virtuals : true}
})

// BookingSchema.virtuals("finalPrice").get(function () {
//     return this.coupon ?
//         Number.parseFloat(
//             this.price - (this.price * this.coupon.discount) /100
//         ).toFixed(2) : this.price;
// });

const BookingModel = mongoose.model('Booking', BookingSchema);

export default BookingModel
import {  Schema, model } from "mongoose"

const CouponSchema = new Schema({
    name:{
        type:String,
        unique : true ,
        lowercase : true, 
        required : true
    },

    image:{
        secure_url:{
            type:String, 
            required:true},
        public_id :{
            type : String,
            required : true}
    },
    amount : {
        type : Number,
        default:1,
        min:1,
        required : true
    },
    expireDate : Date,
    addedBy : {
        type : Schema.Types.ObjectId,
        ref: 'User',
        required : false         //Convert to true after adding the user
    },
    usedBy : [{
        type : Schema.Types.ObjectId,
        ref: 'User'
    }],
    categoryId : {
        type: Schema.Types.ObjectId,
        ref : 'Category',
        required:true
    }
    
});

    const CouponModel = model('Coupon',CouponSchema);

    export default CouponModel;
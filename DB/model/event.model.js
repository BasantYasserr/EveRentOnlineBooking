import { model , Schema } from 'mongoose'

const EventSchema = new Schema({

    title : {required : true , type : String , lowercase : true},
    UserId : {required : true , type : Schema.Types.ObjectId,ref: 'User',},
    CompanyId : {required : false , type : Schema.Types.ObjectId,ref: 'Company',},
    categoryId : {required : true , type : Schema.Types.ObjectId,ref:"Company"},
    images : [
        {secure_url:{required:true,type:String},public_id:{type:String , required:true}}
    ],
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : false            //Convert true after adding the user
    },
    updatedBy : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    },
    deletedBy : {
        type : Schema.Types.ObjectId,
        ref: 'User',
    },
    price: {required : true , type : Number},
    discount: {required : false , type : Number},
    priceAtfterDiscount :Number,
    stock: {required : true , type : Number, default : 1 , min : 1},

    description :{
            type : String,
            required: true 
    },
    location :{
            type : String,
            required: true 
    },
    date : {
            type : String,
            required : true
    },
    slug : {
            type:String , 
            required:true , 
            lowercase:true 
    },

},{timestamps:true});

const EventModel = model('Event', EventSchema)

export default EventModel
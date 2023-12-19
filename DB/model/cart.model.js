import { mongoose} from 'mongoose'

const CartSchema = mongoose.Schema({

    UserId : {required : true , unique : true, ref : "User" , type : mongoose.Schema.Types.ObjectId},
    events : [{
        eventId : {required:true ,ref : "Event", type : mongoose.Schema.Types.ObjectId, unique : true},
        quantity : {type : Number, default : 1, required:true}
    }]
    
}, {timestamps : true});

const CartModel = mongoose.model('Cart', CartSchema)

export default CartModel 
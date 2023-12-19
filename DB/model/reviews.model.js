import { mongoose} from 'mongoose'

const ReviewsSchema = mongoose.Schema({

    
    text : {required:true , type : String},
    rating : {type : Number , required : true},
    userId : {required : true , type : mongoose.Schema.Types.ObjectId,ref: 'User',},
    eventId : {required : true , type : mongoose.Schema.Types.ObjectId,ref: 'Event',},

});

const ReviewsModel = mongoose.model('Review', ReviewsSchema)

export default ReviewsModel 
import { mongoose} from 'mongoose'

const CategorySchema = mongoose.Schema({

    name : {required : true , type : String , unique:true},
    image : {
        secure_url:{
            type:String, 
            required:true
            },
        public_id :{
            type : String,
            required : true
        }
        
        },
    UserId : {required : true , type : mongoose.Schema.Types.ObjectId,ref: 'User',},
    CompanyId : {required : false , type : mongoose.Schema.Types.ObjectId,ref: 'Company',},

},{
    toJSON: {virtuals: true},
    toObject:{virtuals: true},
    timestamps: true
});
CategorySchema.virtual('eventss',{
    localField: '_id',
    foreignField: 'categoryId',
    ref: 'Event'
})

const CategoryModel = mongoose.model('Category', CategorySchema)

export default CategoryModel  
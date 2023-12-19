import { mongoose} from 'mongoose'

const CompanySchema = mongoose.Schema({

    name : {required : true, type : String, unique : true, lowercase : true},
    logo : {required:true , type : String},
    UserId : {required : true , type : mongoose.Schema.Types.ObjectId,ref: 'User'},
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false         //Convert to true after adding the user
    },
    updatedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false      
    }
}, {timestamps:true});

const CompanyModel = mongoose.model('Company', CompanySchema)

export default CompanyModel
import { mongoose} from 'mongoose'

const UserSchema = mongoose.Schema({
    firstName : String ,
    lastName : String,
    username : {
        required : true ,
        type : String ,
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char']
    },
    password : {required :[true ,'password must be typed'] , type : String},
    email : {required : true , type : String},
    age: {required : false , type : Number},
    gender : {
        String,
        enum:['male','female']
    },
    confirmEmail :{
        type : Boolean,
        default: false 
    },
    status : { 
        type : String ,
        default : 'offline',
        enum : ['offline' , 'online' , 'blocked' ]
    },
    image:{
        secure_url:{
            type:String, 
            required:true
        },
        public_id :{
            type : String,
            required : true
        }
    },
    role : {
        type : String ,
        default : 'User',
        enum:['Admin','User']
    },

    token : String,
    frogetPass:String
});

const UserModel = mongoose.model('User', UserSchema)

export default UserModel 
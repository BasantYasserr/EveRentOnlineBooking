import mongoose from 'mongoose';

const connectDB =async  ()=>{
    
 return await mongoose.connect(process.env.ConnectDB).then(res =>{
    console.log('Database Connected');
 }).catch (err =>{  console.log(err);});

}

export default connectDB;

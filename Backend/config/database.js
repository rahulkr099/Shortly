import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const connect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("Database Connection established");
    })
    .catch((err)=>{
        console.log("Connection Issues with Database:",err);
        process.exit(1);
    })
}
import mongoose, { Document } from "mongoose";
interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    role:"user" | "partner" | "admin"
    createdAt:Date;
    updatedAt:Date;
    otp?: string;
    otpExpiry?: Date;
    isVerified?: boolean;
}

const userSchema= new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin","partner"]
    },
    otp: { 
        type: String 
    },
    otpExpiry: {
         type: Date 
    },
    isVerified: {
         type: Boolean, default: false 
    },
},{timestamps:true})

const User=mongoose.models.User || mongoose.model("User",userSchema)
export default User
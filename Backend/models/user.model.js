import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type:String,
        require: true,
        trim:true,
    },
    password: {
        type: String,
        required: function () {
            return this.authType !== 'google'; // Only required for non-Google auth
        },
    },
    authType: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    role:{
        type:String,
        enum:["admin","user"],
    },
    resetPasswordToken:{
        type:String,
    },
    accessToken: {
        type: String,
    },
    refreshToken:{
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
})
export default mongoose.model('User',userSchema);
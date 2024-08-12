
const mongoose = require("mongoose")

const personalSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:false
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true 
    },
    location:{
        type:String,
        required:true
    },
    photoPreview:{
        type:String,
        required:false
    },
    resumePath:{
        type:String,
        required:true
    }
    
})

const educationSchema = new mongoose.Schema({
    degreeName:{
        type:String,
        required:true
    },
    stream:{
        type:String,
        required:true
    },
    startYear:{
        type:Number,
        required:true
    },
    endYear:{
        type:Number,
        required:true
    }
})

const profileSchema = new mongoose.Schema({
    personal:personalSchema,
    education:[educationSchema]
},{
    timestamps:true
})

const profileModel = new mongoose.model('profile',profileSchema)

module.exports = profileModel
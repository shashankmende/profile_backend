
const mongoose = require("mongoose")

const schema1 = new mongoose.Schema({
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
    }
})

const schema2 = new mongoose.Schema({
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
    personal:schema1,
    education:[schema2]
},{
    timestamps:true
})

const profileModel = new mongoose.model('profile',profileSchema)

module.exports = profileModel

const mongoose = require("mongoose")

const registrationSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
    
},
{
    timestamps:true
}
)

const registrationModel = new mongoose.model('registrations',registrationSchema)

module.exports = registrationModel
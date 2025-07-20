import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({

    doctor:{
        type:String,
        required:true
    },
speciality:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    hospital:{
        type:String,
        required:true
    },
    doctor_email:{
        type:String,
      
    },
    doctor_phone:{
        type:String,
        required:true
    },
    biography:{
        type:String,
       
    },
    availability:{
        type:String,
       
    },
    user_id:{
        type:String
    },
    price: {
        type:String
    }
 
})

export default mongoose.model("doctor",doctorSchema)
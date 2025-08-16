import mongoose from "mongoose";

const hospitalSchema = mongoose.Schema({
     user_id:{
        type:String
    },
    hospital_image:{
        type:String
    },
    hospital:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    bed:{
            type:Number,
            required:true
        },
        departments:{
            type:Number,
        required:true
    },
    hospital_email:{
    type:String
    },
    hospital_phone:{
        type:String,
        required:true
    },
    hospital_address:{
        type:String,
        required:true
    },
    description:String
})

export default mongoose.model("hospital",hospitalSchema)
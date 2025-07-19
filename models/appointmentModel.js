import mongoose from "mongoose"

const appointmentSchema = mongoose.Schema({
    doctor:{
        type:String,
        required:[true]
    },
    speciality:{
        type:String,
        required:[true]
    },
    hospital:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    fee:{
        type:String,
        required:true
    },
    user_id:{
        type:String
    },
    disabled: {
    type: Boolean,
    default: true,
  },
})


export default mongoose.model("appointment",appointmentSchema);
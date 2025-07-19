import asyncHandler from "express-async-handler"
import appointment from "../models/appointmentModel.js"

export const createAppointment = asyncHandler(async (req,res)=>{
    const {doctor,speciality,hospital,date,time,fee} = req.body;
    if( !doctor || !speciality || !hospital || !date || !time || !fee ){
        res.status(400).json({msg:"all field are required"})

    }
    //already booked time and date
    const existingAppointment = await appointment.findOne({date,time})
if(existingAppointment){
    res.status(400).json({msg:"appoinment already booked"})
}
    const newAppointment = await appointment.create({
        doctor,
        speciality,
        hospital,
        date,
        time,
        fee,
        user_id: req.user.id
    });
    res.status(201).json({
      newAppointment,msg:"appointment created",
    })
  
})

export const getAppointments = asyncHandler(async(req,res)=>{
    const appointmentList = await appointment.find({user_id:req.user.id});
    res.status(200).json(appointmentList)
  
})

export const getAllAppointments = asyncHandler(async(req,res)=>{
    const allAppointments = await appointment.find({});
    res.status(200).json(allAppointments)
})

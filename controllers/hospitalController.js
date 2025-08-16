import asyncHandler from "express-async-handler";
import Hospital from "../models/hospitalModel.js";

export const createHospital = asyncHandler(async (req, res) => {
  const {
    hospital,
    type,
    bed,
    departments,
    hospital_phone,
    hospital_address,
    user_id,
  } = req.body;
  if (
    !hospital ||
    !type ||
    !bed ||
    !departments ||
    !hospital_phone ||
    !hospital_address
  ) {
    res.status(400).json({ msg: "all field are required" });
  }
  const existingHospital = await Hospital.findOne({
    hospital,
    hospital_address,
  });
  if (existingHospital) {
    res.status(400).json({ msg: "hospital already exists" });
  }
  const newHospital = await Hospital.create({
    hospital,
    type,
    bed,
    departments,
    hospital_phone,
    hospital_address,
    user_id: req.user.id,
  });
  res.status(200).json(newHospital);
});

export const updateHospital = asyncHandler(async (req, res) => {
  const existingHospital = await Hospital.findById(req.params.id);

  if (
    !existingHospital.user_id ||
    existingHospital.user_id.toString() !== req.user.id
  ) {
    return res.status(400).json({ msg: "you dont have permission to modify" });
  }

  const newHospital = await Hospital.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(newHospital)
});

export const deleteHospital = asyncHandler(async(req,res)=>{
    const hospital = await Hospital.findOneAndDelete( {_id:req.params.id});

if(!hospital){
    res.status(400).json({msg:'hospital not found'})
}
  res.status(200).json({msg:"hospital deleted"})
})

export const getHospitals = asyncHandler(async(req,res)=>{
    const  hospitalList = await Hospital.find({})
    if(!hospitalList){
        res.status(400).json({msg:"there is no hospitals"})
    }
    res.status(200).json(hospitalList)
})
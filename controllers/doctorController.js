import asyncHandler from "express-async-handler";
import Doctor from "../models/doctorModel.js";

export const createDoctor = asyncHandler(async (req, res) => {
  const {
    doctor,
    speciality,
    experience,
    hospital,
    doctor_phone,
    availability,
    price,
  } = req.body;
  if (
    !doctor ||
    !speciality ||
    !experience ||
    !hospital ||
    !doctor_phone ||
    !availability
  ) {
    res.status(400).json({ msg: "all fields are required" });
  }

  const existingDoctor = await Doctor.findOne({ doctor, hospital });
  if (existingDoctor) {
    res.status(400).json({ msg: "doctor already exists" });
  }

  const newDoctor = await Doctor.create({
    doctor,
    speciality,
    experience,
    hospital,
    doctor_phone,
    availability,
    price,
    user_id: req.user.id,
  });
  res.status(200).json(newDoctor);
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const existingDoctor = await Doctor.findById(req.params.id);
  if (
    !existingDoctor.user_id ||
    existingDoctor.user_id.toString() !== req.user.id
  ) {
    req.status(400).json({ msg: "you dont have permission to modify " });
  }

  const newDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(newDoctor);
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOneAndDelete({ _id: req.params.id });

  if (!doctor) {
    res.status(400).json({ msg: "doctor not found" });
  }
  res.status(200).json({ msg: "doctor deleted" });
});

export const getDoctors = asyncHandler(async (req, res) => {
  const doctorList = await Doctor.find();
  if (!doctorList) {
    res.status(400).json({ msg: "there is no doctors" });
  }
  // console.log(doctorList.role)
  res.status(200).json(doctorList);
});

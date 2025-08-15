import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  googleUser,
  refreshAccessToken,
  forgotPassword,
  verifyOtp,
  resetPass,
} from "../controllers/usercontroller.js";
import validateToken from "../middlewares/validateTokenHandler.js";
import {
  createAppointment,
  getAppointments,
  getAllAppointments,
} from "../controllers/appointmentController.js";
import { isAdmin } from "../middlewares/adminVerify.js";
import {
  createHospital,
  updateHospital,
  deleteHospital,
  getHospitals,
} from "../controllers/hospitalController.js";
import {
  createDoctor,
  deleteDoctor,
  getDoctors,
  updateDoctor,
} from "../controllers/doctorController.js";
import razorpay from "../config/razorpay.js";

const router = express.Router();

//Auth routers
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/google", googleUser);
router.post("/auth/refresh", refreshAccessToken);
router.post("/auth/forgotpassword", forgotPassword);
router.post("/auth/verifyotp", verifyOtp);
router.patch("/auth/resetpassword", resetPass);

router.use(validateToken);

const adminRouter = express.Router();
router.use('/admin', adminRouter);
adminRouter.use(isAdmin);

// Admin routes
adminRouter.get("/users", getUsers);
adminRouter.get("/appointments/all", getAllAppointments);
adminRouter.post("/hospital/create", createHospital);
adminRouter.patch("/hospital/update/:id", updateHospital);
adminRouter.delete("/hospital/delete/:id", deleteHospital);
adminRouter.post("/doctor/create", createDoctor);
adminRouter.patch("/doctor/update/:id", updateDoctor);
adminRouter.delete("/doctor/delete/:id", deleteDoctor);


//user profile router
router.get("/user/profile/:id", getUserProfile);
router.patch("/user/update/:id", updateUserProfile);

router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // ₹50 => 5000 paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

//apointment router
router.post("/appointments/book", createAppointment);
router.get("/appointments/user/:id", getAppointments);
//get hospitals
router.get("/hospitals", getHospitals);
//get all doctors list
router.get("/doctors", getDoctors);

export default router;

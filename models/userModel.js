import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: {
      type: String,
      default: "defaultprofile.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },

    bloodGroup: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: Number,
      default: "",
    },
    allergies: {
      type: String,
      default: "",
    },
    currentMedications: {
      type: String,
      default: "",
    },
    medicalHistory: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);

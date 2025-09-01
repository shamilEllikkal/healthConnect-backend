import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import Routers from "./routes/Routers.js"


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;


app.use(express.json());
app.use(cors({
  origin: ['https://healthconnectadmin.netlify.app', 'https://healthconnectbookingapp.netlify.app'],
  credentials: true,
}));


app.use("/api",Routers)



server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
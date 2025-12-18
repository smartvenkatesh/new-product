import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import formRouter from "./routes/formRouter.js"
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/form", formRouter)

mongoose.connect('mongodb+srv://venkatesh619dx_db_user:U7Uft7mhT9CdMQgv@cluster0.g9iwgfm.mongodb.net/form')
    .then(console.log('db connected'))

app.listen(process.env.PORT, () => {
    console.log("server is running");
})
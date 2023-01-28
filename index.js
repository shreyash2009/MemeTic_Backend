import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import morgan from "morgan";
import userRouter from './Routes/User.js'
import memeRouter from './Routes/Meme.js'
import dotenv from 'dotenv'
const app = express();

// dotenv.config(); //you will able to access the value defined in .env file
dotenv.config({path:'config.env'});
app.use(morgan("dev"));
app.use(express.json({
    limit: "30mb",
    extended: true
}));
app.use(express.urlencoded({
    limit: "30mb",
    extended: true
}));
app.use(cors());

app.use("/users/", userRouter); //http://localhost:5000/users/signup
app.use("/meme/", memeRouter); //http://localhost:5000/meme


const PORT = process.env.PORT || 5000;
mongoose.connect("mongodb+srv://Admin:Password@cluster0.twozgvj.mongodb.net/Blog_app?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
}).catch(error => {
    console.log(error)
})
app.get("/", (req, res) => {
    res.send("HEllo express");
})
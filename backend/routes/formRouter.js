import express, { json } from "express";
import User from "../models/user.js";
import Product from "../models/Product.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existing = await User.findOne({ email })
        console.log('existing', existing);
        if (existing) {
            return res.status(400).json({ message: "User already created" })
        }

        const hash = await bcrypt.hash(password, 10)

        console.log("hashedpassword", hash);
        const newUser = {
            name,
            email,
            password: hash
        }
        console.log('newUser', newUser)
        const saved = await User.create(newUser)

        res.status(200).json({ message: "user successfully Register", userId: saved._id })

    } catch (err) {
        console.error(err)
        res.status(500).send({ message: err.message })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }

        // if (user.password !== password) {
        //     return res.status(401).json({ message: "Invalid Password" })
        // }

        const match = await bcrypt.compare(password, user.password)
        console.log("match", match);
        if (!match) {
            return res.status(400).json({ message: "Invalid Password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        console.log("token", token);
        res.status(200).json({ message: "Login Successfully", token, user_id: user._id })
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ message: err.message })
    }
})

router.post("/createItems", async (req, res) => {
    const { productName, productDescription, productPrice } = req.body
    try {
        const existing = await Product.findOne({ productName })
        if (existing) {
            return res.status(400).json({ message: "Product already created" })
        }
        const create = { productName, productDescription, productPrice }
        const saved = await Product.create(create)
        res.status(201).json({ message: "New Product Created" })
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get("/getProducts", async (req, res) => {
    try {
        const getItems = await Product.find({})
        res.status(200).json(getItems)
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

router.put("/updateItem/:id", async (req, res) => {
    const { id } = req.params
    console.log("id", id);
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({ message: "Product Updated", updated })
})

router.delete("/deleteProduct/:id", async (req, res) => {
    const { id } = req.params
    const objectId = new mongoose.Types.ObjectId(id)
    const deleted = await Product.findByIdAndDelete({ _id: objectId })
    res.json({ message: "Product Deleted Successfully" })
})

export default router
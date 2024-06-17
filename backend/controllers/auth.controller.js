import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

//signup function
export const signup = async (req, res) => {

    try {

        const { fullname, username, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid Email Format." })

        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken." })
        }

        const existingEmail = await User.findOne({ username });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already registered." })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password Must me 6 characters long." })
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg

            })
        }
        else {
            res.status(401).json({ error: "Invalid user data." })
        }
    }

    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }

}


//login function
export const login = async (req, res) => {
    try {
        
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const logout = async (req, res) => {
    res.json({
        message: "You've reaced the logout endpoint"
    })
}
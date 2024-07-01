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

        const existingEmail = await User.findOne({ email });
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

            console.log(`User Signed up ${newUser.email}`)
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

        const { username, password } = req.body;
        const user = await User.findOne({ username })
        const isPassCorrect = await bcrypt.compare(password, user?.password || "")
        if (!user || !isPassCorrect) {
            return res.status(400).json({ error: "Invalid username or Password." })
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            message: "User Logged in",
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg

        })
        console.log(`User Logged in ${user.email}`)

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

//logout function
export const logout = async (req, res) => {
    try {

        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out Successfully." })
        console.log("Logged Out Successfully.")

    } catch (error) {

        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })

    }
}

export const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
        console.log(`User Fetched ${user.email}`)

    } catch (error) {
        console.log(error)
        console.log("Login First to fetch the User")
        res.status(500).json({ error: "Internal Server Error", message: "Login First to fetch the User" })
    }
}
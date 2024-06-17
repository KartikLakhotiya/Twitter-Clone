import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            res.status(401).json({ error: "Unauthorised: No token provided or Login first." })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            res.status(401).json({ error: "Invalid Token." })
        }

        const user = await User.findById(decoded.userID).select("-password");
        if (!user) {
            res.status(404).json({ error: "User Not Found" })
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
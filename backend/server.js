import express from 'express';
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv';
import connectDB from './db/MongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Server is Ready.")
})


app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDB();
})
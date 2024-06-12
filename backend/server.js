import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send("Server is Ready.")
})

app.listen(8000, () => {
    console.log(`Server running on port 8000`)
})
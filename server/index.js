const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes)

const PORT = process.env.PORT || 4141;
console.log(PORT);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error:', err.message);
})

app.listen(4141, ()=>{
    console.log(`Server is runing at http://localhost:${PORT}`);
})
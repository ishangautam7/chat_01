const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const messageRoute = require('./routes/messageRoute')
const socket = require('socket.io');
const path = require("path")
const admin = require("firebase-admin")

const serviceAccountKey = require('./config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
});

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoute)

app.use(express.static(path.join(__dirname, '../client/public'))); 

app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname,"../client/public/index.html"))
})

const PORT = 4000;
console.log(PORT);

mongoose.connect("mongodb+srv://ishangautam:ishan123@datingapp.o2ofz.mongodb.net/")
.then(()=>{
    console.log("Connected to Database")
}).catch((err)=>{
    console.log("Error", err.message)
})

const server = app.listen(4000, ()=>{
    console.log(`Server is running at http://localhost:4000 `)
})


const io = socket(server, {
    cors:{
        origin: ["https://chat-01-1.onrender.com/"],
    }
})

global.onlineUsers = new Map();
io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id)
    })
    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})


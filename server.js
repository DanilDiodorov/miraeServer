const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

let messages = []

setInterval(() => {
    messages.map(message => {
        io.emit("addMessage", message)
        console.log(message.text + " sending this message again")
    })
}, 1000)

io.on("connection", socket => {
    console.log(`User ${socket.id} is connected`)

    socket.on("addRoom", data => {
        io.emit("addRoom", data)
    })

    socket.on("addMessage", data => {
        let isExist = false
        messages.map(message => {
            if (message.messageID === data.messageID)
                isExist = true
        })
        if (isExist === false){
            messages.push(data)
            io.emit("messageOnServer", data)
        }
    })

    socket.on("messageRecieved", data => {
        messages = messages.filter(message => {
            return message.messageID !== data.messageID
        })
        io.emit("messageRecieved", data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

httpServer.listen(5000, () => {
    console.log("Server is running!")
});
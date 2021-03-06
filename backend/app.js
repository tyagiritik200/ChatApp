const express = require('express');
const config = require("./Config/key");
const app = express();
var morgan= require('morgan')
const cors = require('cors');
app.use(express.json());
const path=require('path');
app.use(cors());

// const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 7000

var mongoose = require('mongoose');

var MONGO_URI=config.MONGO_URI;
mongoose.connect(MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(res => console.log('DB connected'))
    .catch(err => console.log('Error Occured' + err));


const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(morgan('dev'))


var users = []
let NoOfVideoClients = 0;
let videoUsers = [];
let videoRoom;
let CallTo;
io.on('connection', socket => {
    console.log('Socket connected on id :'+socket.id);
    socket.on('join', (curruser) => {
        console.log('New User Joined :'+curruser);
        var data = {
            socketId: socket.id,
            userId: curruser
        }
        users.push(data);
        socket.join(curruser);
        io.emit('online', users);
    })
    socket.on('send-chat-msg', (msg) => {
        console.log('Send Chat Msg')
        socket.to(msg.to).emit('accept-msg', msg);
    })
    socket.on('send-notification',({note,id})=>{
        console.log("Notification is :"+note+" to"+id);
        socket.to(id).emit('received-notification',{note})
    })

    socket.on('offline', () => {
        // var leftuser=users.find(user=>user.socketId==socket.id);
        // console.log(leftuser.userId+" left the room");
        users = users.filter(user => user.socketId != socket.id)
        console.log('User offline with id :'+socket.id);
        // LeftRoom();
        io.emit('online', users);
    })




    socket.on('join-video', ({ room, from, to,fromName }) => {
        let data = {
            from,
            to,
            room,
            fromName
        }
        CallTo=to;
        videoRoom = room;
        socket.join(room);
        socket.to(to).emit('accept-video-call', data);
        console.log("Video Call coming From :" + fromName + " To :" + to + " in room :" + room);
    })
    socket.on('CallAccepted', ({ videodata }) => {
        socket.join(videodata.room);
        console.log(videodata.to + " accepted the call in room :" + videodata.room + " called by " + videodata.from);
    })
    socket.on('CallRejected',()=>{
        socket.to(videoRoom).emit('RemovePeer');
    })


    socket.on('NewVideoClient', (currUser) => {
        console.log('New Client just came :' + NoOfVideoClients);
        if (!videoUsers[currUser] && NoOfVideoClients < 2) {
            console.log('New User Came with id :'+currUser);
            if (NoOfVideoClients == 1)
                socket.emit('CreatePeer');
            NoOfVideoClients++;
            videoUsers[currUser] = socket.id;
            console.log('New Client came' + NoOfVideoClients);
        }
        else {
            socket.emit('SessionActive');
        }
    })
    socket.on('Offer', SendOffer);
    socket.on('Answer', SendAnswer);
    socket.on('Leave-Video-Room', LeftRoom);

    function SendOffer(offer) {
        console.log('Video Room in send offer :' + videoRoom);
        socket.to(videoRoom).emit('BackOffer', offer);
    }
    function SendAnswer(answer) {
        socket.to(videoRoom).emit('BackAnswer', answer);
    }

    function LeftRoom(currUser) {
        if (NoOfVideoClients > 0 && videoUsers[currUser]) {
            if(NoOfVideoClients==1)
            {
                console.log('Calling to :'+CallTo);
                socket.to(CallTo).emit('Call-Discarded');
            }
            console.log('User left with id :'+currUser);
            NoOfVideoClients--;
            if(NoOfVideoClients>0)
                socket.to(videoRoom).emit('RemovePeer');
            videoUsers[currUser] = null;
            socket.leave(videoRoom);
        }
        console.log('After Leaving video clients are :' + NoOfVideoClients);
    }

})


const userRoutes = require('./Routes/users');
app.use('/user', userRoutes);

const msgRoutes = require('./Routes/message');
app.use('/msg', msgRoutes);

const changePassRoutes = require('./Routes/changepass');
app.use('/pass', changePassRoutes);




if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"../",'client','build')))
  
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,"../",'client','build','index.html'))
    })
  }

  

  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
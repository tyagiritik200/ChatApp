import React, { useState, useEffect } from 'react';
import '../CSS/layout.css';
import HeadContact from './headContact';
import ChatHead from './chatHead';
import Notification from './notification';
import {Provider} from './effect';
import { useSelector} from 'react-redux';
import io from 'socket.io-client';
import jwt from 'jsonwebtoken';
import IncomingCallGrid from './incomingCallGrid';
import Axios from 'axios';
// const server = 'http://localhost:7000';
// const server='https://ritikchatapp.herokuapp.com'
const socket = io.connect();



function SwitchLayout(props){
    if(props.layout===2)
        return <ChatHead userid={props.userid} username={props.username} onlineusers={props.onlineusers} socket={socket} currUserName={props.currUserName}/>;
    else if(props.layout===3)
        return <Notification socket={socket}/>
    else
        return <HeadContact socket={socket}/>
}
function Layout()
{
    const [layout,switchlay]=useState(1);
    const [userid,setUserId]=useState('');
    const [username,setUserName]=useState('');
    const [currUserName,setCurrUserName]=useState('');
    const [onlineusers,setOnlineUsers]=useState([]);
    const [call,setCall]=useState(false);
    const [videodata,setVideoData]=useState({});
    const token=useSelector(state=>state.auth.token);
    const curruserid=jwt.decode(token).id;
    const changeLayout=(id,name,lay)=>{
        switchlay(lay);
        setUserId(id);
        setUserName(name);
    }
    useEffect(()=>{
        Axios({
            method: 'get',
            url: '/user/getCurrentUser',
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
        .then(user => {
            setCurrUserName(user.data.name);
        })
    },[])
    useEffect(()=>{
        // socket.connect();
        socket.emit('join', curruserid);
        socket.on('online',(users)=>{
            setOnlineUsers(users);
        })
        return (()=>{
            socket.emit('disconnect');
        })
    },[])
    useEffect(()=>{
        socket.on('accept-video-call',(data)=>{
        //data contains from id and to id and room
            setVideoData(data);
            setCall(!call);
        })
        socket.on('Call-Discarded',()=>{
            setCall(false);
        })

    },[])
    const data={
        changeLayout,
        socket,
        userid
    }
    return(
        <div className="container layout p-0">
            <Provider value={data}>
                <SwitchLayout layout={layout} userid={userid} username={username} onlineusers={onlineusers} currUserName={currUserName}/>
                {call?<IncomingCallGrid socket={socket} videodata={videodata} setCall={setCall}/>:null}
            </Provider>
        </div>
    );
}

export default Layout;
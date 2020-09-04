import React, { useState, useEffect } from 'react';
import logo from '../Pics/avatar.png';
import '../CSS/chatHeader.css';
import { Consumer } from './effect';
import Chatcontainer from './chatContainer';
import VideoGrid from './videoGrid';
import jwt from 'jsonwebtoken';
import { useSelector } from 'react-redux';
import { v4 as v4uuid } from 'uuid';

function ChatHead(props) {
    const token = useSelector(state => state.auth.token);
    const from = jwt.decode(token).id;
    var [online, onlineUser] = useState(false);
    var [showVideo, setShowVideo] = useState(false);
    useEffect(() => {
        var index = props.onlineusers.findIndex(user => user.userId == props.userid);
        if (index != -1)
            onlineUser(true);
        else
            onlineUser(false);
    })
    var openVideo = () => {
        console.log('Open Video ' + showVideo);
        const room = v4uuid();
        setShowVideo(true);
        props.socket.emit('join-video', { room, from, to: props.userid, fromName: props.currUserName });
    }

    return (

        <Consumer>
            {({ changeLayout, socket }) =>
                <>
                    <div className="card">
                        <div className="card-header chead pl-2">
                            <div className="media">
                                <i className="btn fa fa-arrow-left pl-0 pr-2 my-2 text-align-top" aria-hidden="true" onClick={() => changeLayout('', '', 1)}></i>
                                <img className="text-align-top mr-3 mt-0" src={logo} alt="Generic placeholder image" height="40px" width="40px" />
                                <div className="media-body align-self-center">
                                    <div className="d-inline-block mt-0">
                                        <h5 className="align-self-center p-0 m-0">{props.username}</h5>
                                        <p className="p-0 m-0">{online ? "Online" : ""}</p>
                                    </div>
                                    <i className="fa fa-ellipsis-v float-right d-inline-block text-align-top btn" aria-hidden="true"></i>
                                    <button onClick={openVideo} type="button" className="btn float-right d-inline-block mr-4 ">
                                        <i className="fas fa-video" aria-hidden="true"></i>
                                    </button>
                                    {showVideo ? <VideoGrid username={props.username} userid={props.userid} socket={socket} setShowVideo={setShowVideo}/> : null}
                                </div>
                            </div>
                        </div>
                        <div className="card-body m-0 p-0 chatbody">
                            <Chatcontainer userid={props.userid} socket={socket} />
                        </div>
                    </div>
                </>
            }
        </Consumer>


    );
}

export default ChatHead;
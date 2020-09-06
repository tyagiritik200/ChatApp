import React, { useEffect, useState } from 'react';
import '../CSS/videoGrid.css';
import { useSelector } from 'react-redux';
import jwt from 'jsonwebtoken';
import Peer from 'simple-peer';

var localStream;

function VideoGrid(props) {
    //props has username,userid,socket

    const socket = props.socket;
    const token=useSelector(state=>state.auth.token);
    const currUser=jwt.decode(token).id;
    const [modalState, setModalState] = useState(true);

    const myVideo = document.createElement('video');
    myVideo.id = 'clientVideo'
    myVideo.style.width = "100%";
    myVideo.style.height="100%";
    myVideo.style.objectFit="cover";
    myVideo.muted = true;


    const partnerVideo = document.createElement('video');
    partnerVideo.id = 'peerVideo';
    partnerVideo.style.width = "100%";
    partnerVideo.style.height="100%";
    partnerVideo.style.objectFit="cover";

    let client = {};
    useEffect(() => {
        console.log('Modal State of Video Grid '+modalState);
        // Get Stream
        if(modalState){
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
            .then(stream => {
                localStream =stream
                socket.emit('NewVideoClient',currUser);
                addMyVideoStream(stream);

                function InitPeer(type) {
                    let peer = new Peer({
                        initiator: (type == 'init') ? true : false,
                        trickle: false,
                        stream: stream
                    })
                    peer.on('stream', (stream) => {
                        addPartnerVideoStream(stream);
                    })
                    return peer;
                }

                //For Peer of type Init
                function MakePeer() {
                    client.gotAnswer = false;
                    let peer = InitPeer('init');
                    peer.on('signal', (data) => {
                        if (!client.gotAnswer)
                            socket.emit('Offer', data);
                    })
                    client.peer = peer;
                }

                //For Peer of type not Init
                function FrontAnswer(offer) {
                    let peer = InitPeer('notInit');
                    peer.on('signal', (data) => {
                        socket.emit('Answer', data);
                    })
                    peer.signal(offer);
                }

                function SignalAnswer(answer) {
                    client.gotAnswer = true;
                    let peer = client.peer;
                    if(peer)
                        peer.signal(answer);
                }

                function RemovePeer(){
                    console.log('Remove Peer');
                    // if(document.getElementById('peerVideo'))
                    //     document.getElementById('peerVideo').remove();
                    setModalState(!modalState);
                    localStream.getTracks().forEach(tracks=>tracks.stop())
                    socket.emit('Leave-Video-Room',currUser);
                    if(props.setShowVideo)
                        props.setShowVideo(false);
                    if(props.setCall)
                        props.setCall(false);
                }

                socket.on('BackOffer',FrontAnswer);
                socket.on('BackAnswer',SignalAnswer);
                socket.on('SessionActive',SessionActive);
                socket.on('CreatePeer',MakePeer);
                socket.on('RemovePeer',RemovePeer);
            })
            .catch(err => document.write("Can't Do Video Call without Camera Permissions"));
        }
    },[])


    function addMyVideoStream(stream) {
        myVideo.srcObject = stream;
        myVideo.addEventListener('loadedmetadata', () => {
            myVideo.play();
        })
        document.getElementById('myVideo').append(myVideo);
    }

    function addPartnerVideoStream(stream) {
        partnerVideo.srcObject = stream;
        partnerVideo.addEventListener('loadedmetadata', () => {
            partnerVideo.play();
        })
        document.getElementById('partnerVideo').append(partnerVideo);
    }

    function SessionActive(){
        document.write('Session Active Please come back later');
    }

    function closeVideoGrid(){
        setModalState(!modalState);
        localStream.getTracks().forEach(tracks=>tracks.stop())
        socket.emit('Leave-Video-Room',currUser);
        if(props.setShowVideo)
            props.setShowVideo(false);
        if(props.setCall)
            props.setCall(false);
    }

    return (
        <div className={"modal fade" + (modalState ? " show d-block" : " d-none")} role="dialog">
            <div className="modal-dialog" style={{ width: "60vh" }} role="document" id="modaldialogpos">


                <div className="modal-content">
                    <div className="modal-header text-align-center">
                        <h4 className="modal-title m-auto">{props.username}</h4>
                    </div>
                    <div className="modal-body m-0 p-0">
                        <div id="videogrid" className="">
                            <div id="partnerVideo" style={{height:"65vh"}}></div>
                            <div id="myVideo" className="bg-danger"></div>
                        </div>
                    </div>
                    <div className="modal-footer text-align-center">
                        <button type="button" className="btn btn-danger m-auto" onClick={closeVideoGrid}>Cancel</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default VideoGrid;






























import React, { useState, useEffect } from 'react';
import VideoGrid from './videoGrid';

function IncomingCallGrid(props){
    //props contains videodata(from id, room and to id) and socket

    const [openVideo,setOpenVideo]=useState(false);
    const [modalState,setModalState]=useState(true);
    const socket=props.socket;

    const acceptIncomingCall=()=>{
        setModalState(false);
        setOpenVideo(true);
        console.log('Open Video there'+openVideo)
        socket.emit('CallAccepted',{videodata:props.videodata});   
    }
    const rejectIncomingCall=()=>{
        setModalState(false);
        socket.emit('CallRejected');
        props.setCall(false);
    }

    return (
        <>
            <div className={"modal fade" + (modalState ? " show d-block" : " d-none")} role="dialog">
                 <div className="modal-dialog">


                     <div className="modal-content">
                         <div className="modal-header text-align-center">
                            <h4 className="modal-title m-auto">{props.videodata.fromName}</h4>
                         </div>
                         <div className="modal-footer text-align-center">
                             <button type="button" onClick={acceptIncomingCall} className="btn btn-success m-auto">Accept</button>
                             <button type="button" className="btn btn-danger m-auto" onClick={rejectIncomingCall}>Reject</button>
                         </div>
                     </div>

                 </div>
            </div>
            {console.log('Open Video Here'+openVideo)}
            {openVideo?<VideoGrid username={props.videodata.fromName} userid={props.from} socket={socket} setCall={props.setCall}/>:null}
        </>
    );
}

export default IncomingCallGrid;
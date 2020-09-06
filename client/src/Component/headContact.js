import React, { useState,useEffect } from 'react';
import '../CSS/headContact.css';
import ChatContact from './chatContact';
import Request from './request';
import PYMK from './pymk';
import { useDispatch } from 'react-redux'
import { Consumer } from './effect';

function ChatTab(props) {
    if (props.tab === 1)
        return <ChatContact socket={props.socket}/>;
    else if (props.tab === 2)
        return <Request socket={props.socket}/>;
    else
        return <PYMK socket={props.socket}/>;
}

function HeadContact(props) {
    const [tab, switchTab] = useState(1);
    const [note,setNote]=useState(false);
    const tabSwitch = (tab) => {
        switchTab(tab);
    }
    const dispatch = useDispatch();
    function logout(socket) {
        socket.emit('offline');
        dispatch({
            type: 'LOGOUT_SUCCESS',
            payload: {
                err: ''
            }
        })
    }

    useEffect(()=>{
        props.socket.on('received-notification',({note})=>{
            setNote(true);
        })
    },[])

    return (
        <Consumer>
            {({ changeLayout,socket,userid }) =>
                <>
                    <div className="card">
                        <div className="card-header conthead">
                            <p className="d-inline-block my-1 p-0">ChatApp</p>



                            <div className="btn-group dropleft d-inline-block float-right my-1">
                                <a type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-user"></i>
                                </a>
                                <div className="dropdown-menu mt-4">
                                    <a className="dropdown-item" href="#"><i className="fas fa-user-circle mr-2"></i>Profile</a>
                                    <div className="dropdown-divider"></div>
                                    <a onClick={()=>logout(socket,userid)} className="dropdown-item" href="#"><i className="fas fa-sign-out-alt mr-2"></i>Logout</a>
                                </div>
                            </div>




                            <i onClick={() => changeLayout('', '', 3)} style={{cursor:"pointer"}} className="fa fa-bell d-inline-block float-right mr-5 my-2" aria-hidden="true"></i>


                            <ul className="nav nav-pills card-header-pills nav-justified mt-4">
                                <li className="nav-item" onClick={() => tabSwitch(1)}>
                                    <a className="nav-link" href="#">Chats</a>
                                </li>
                                <li className="nav-item" onClick={() => tabSwitch(2)}>
                                    <a className="nav-link" href="#">Request</a>
                                </li>
                                <li className="nav-item" onClick={() => tabSwitch(3)}>
                                    <a className="nav-link" href="#">PYMK</a>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body m-0 p-0 contactlist">
                            <ChatTab tab={tab} socket={socket}/>
                        </div>
                    </div>
                </>
            }

        </Consumer>
    );
}

export default HeadContact;
import React, { useEffect, useState } from 'react';
import logo from '../Pics/avatar.png';
import { Consumer } from './effect';
import '../CSS/chatContact.css';
import { useSelector,useDispatch } from 'react-redux';
import Axios from 'axios';
import moment from 'moment';
import Loading from './loading';
function ChatContact(props) {
    const [contacts,setContacts]=useState([]);
    const [lastmsg,setLastMsg]=useState({});
    const [loading,setLoading]=useState(true);
    const token=useSelector(state=>state.auth.token);
    const dispatch=useDispatch();
    useEffect(()=>{
        props.socket.on('accept-msg', msg => {
            setLastMsg(msg);
        })
    },[])
    useEffect(()=>{
        setLoading(true);
        Axios({
            method: 'get',
            url: '/user/getCurrentUser',
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
        .then(user=>{
            setContacts(user.data.contacts);
            setLoading(false);
        })
        .catch(err=>{
    
        })
    },[])

    return (
        <Consumer>
            {({changeLayout}) =>
                <>
                {loading?<Loading/>:
                    <ul className="list-group list-group-flush">
                        {contacts.map(contact => {
                            {var recentmsgtime=(lastmsg && moment(lastmsg.date).format("DD/MM/YYYY")===moment().format("DD/MM/YYYY"))?(moment(lastmsg.date).format("hh:mm a")):""}
                            {var databasemsgtime=(contact.lastmsg) ? (moment(contact.lastmsg.date).format("DD/MM/YYYY")==moment().format("DD/MM/YYYY")?moment(contact.lastmsg.date).format("hh:mm a"):moment(contact.lastmsg.date).format("DD/MM/YYYY")):""}
                            return (
                                <li key={contact._id} className="list-group-item p-1 contact" onClick={() =>changeLayout(contact._id,contact.name,2)}>
                                    <div className="media">
                                        <img className="align-self-center mr-3 rounded-circle img-fluid" src={logo} alt="Generic placeholder image" height="60px" width="60px" />
                                        <div className="media-body">
                                            <div className="row">
                                            <div className="col-9 text-wrap" style={{width: "6rem"}}>
                                            <h5 className="mt-1 mb-1">{contact.name}</h5>
                                            {lastmsg && lastmsg.from==contact._id?
                                                (lastmsg.msgtype=='text'?(<p className="col-12 text-truncate p-0 m-0">{lastmsg.msg}</p>):(lastmsg.msgtype=='image')?<><i className="fas fa-image"></i><span> Photo</span></>:(lastmsg.msgtype=='video')?<><i className="fas fa-video"></i><span> Video</span></>:""):
                                            (contact.lastmsg?
                                                (contact.lastmsg.msgtype=='text'?(<p className="col-12 text-truncate p-0 m-0">{contact.lastmsg.msg}</p>):(contact.lastmsg.msgtype=='image')?<><i className="fas fa-image"></i><span> Photo</span></>:(contact.lastmsg.msgtype=='video')?<><i className="fas fa-video"></i><span> Video</span></>:"")
                                            :"")
                                            }
                                            </div>
                                            <div className="col-3">
                                                <p style={{fontSize:"80%"}} className="mt-1 mb-1 p-0">{(lastmsg && lastmsg.from==contact._id)?recentmsgtime:(contact.lastmsg ?databasemsgtime:"")}</p>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    }
                </>}

        </Consumer>
    );
}

export default ChatContact;
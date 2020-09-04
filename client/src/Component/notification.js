import React, { useState, useEffect } from 'react';
import { Consumer } from './effect';
import jwt from 'jsonwebtoken';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import Loading from './loading';

function Notification(props) {
    const token = useSelector(state => state.auth.token);
    const [notifications, setNotifications] = useState([]);
    const [loading,setLoading]=useState(true);
    useEffect(() => {
        setLoading(true);
        Axios({
            method: 'get',
            url: '/user/getNotifications',
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
            .then(results => {
                setNotifications(results.data.notifications);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error Occured :' + err)
            })
    }, [])
    useEffect(()=>{
        props.socket.on('received-notification',({note})=>{
            setNotifications(notifications => [note,...notifications]);
        })
    },[])
    return (

        <Consumer>
            {({ changeLayout, socket }) =>
                
                <>
                    <div className="card">
                        <div className="card-header chead pl-2">
                            <div className="media">
                                <i className="btn fa fa-arrow-left pl-0 pr-2 my-2 text-align-top" aria-hidden="true" onClick={() => changeLayout('', '', 1)}></i>
                                <h5 className="align-self-center p-0 m-0">Notifications</h5>
                            </div>
                        </div>
                        <div className="card-body m-0 p-0 chatbody">
                            {loading?<Loading/>:
                            <ul className="list-group list-group-flush">
                                {notifications.map((note,index) => {
                                    return (
                                        <li key={index} className="list-group-item px-2 py-2">
                                            <div className="media">
                                                <div className="media-body align-self-center">
                                                    <h5>{note}</h5>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            }
                        </div>
                    </div>
                </>
            }
        </Consumer>


    );
}

export default Notification;
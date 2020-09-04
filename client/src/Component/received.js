import React, { useState, useEffect } from 'react';
import logo from '../Pics/avatar.png';
import { useSelector,useDispatch } from 'react-redux';
import Axios from 'axios';
function Received(props) {
    const [received, setReceived] = useState([]);
    const token = useSelector(state => state.auth.token);
    const [currname,setCurrName]=useState('');
    const dispatch=useDispatch();
    useEffect(() => {
        Axios({
            method: 'get',
            url: '/user/getCurrentUser',
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
            .then(user => {
                setReceived(user.data.received);
                setCurrName(user.data.name);
            })
            
    }, [])
    const accept = (id) => {
        Axios({
            method: 'patch',
            url: '/user/acceptReceived/' + id,
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
            .then(result => {
                console.log('Add to Contacts');
                let newreceived=received.filter(user=>user._id!==id);
                setReceived(newreceived);
                props.socket.emit('send-notification',({note:`${currname} has accepted your request`,id}))
            })
            .catch((err) => {
                console.log('Cannot add to sent :' + err);
            })
    }
    const reject = (id) => {
        Axios({
            method: 'patch',
            url: '/user/cancelReceived/' + id,
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
            .then(result => {
                console.log('Cancel Received');
                let newreceived=received.filter(user=>user._id!==id);
                setReceived(newreceived);
                props.socket.emit('send-notification',({note:`${currname} has rejected your request`,id}))
            })
            .catch((err) => {
                console.log('Cannot add to sent :' + err);
            })
    }
    return (
        <ul className="list-group list-group-flush">
            {received.map(person => {
                return (
                    <li key={person._id} className="list-group-item p-1">
                        <div className="media">
                            <img className="align-self-center mr-3" src={logo} alt="Generic placeholder image" height="40px" width="40px" />
                            <div className="media-body align-self-center">
                                <h5 className="mt-0">{person.name}</h5>
                            </div>
                            <i onClick={() => accept(person._id)} className="btn fa fa-check d-inline-block float-right my-auto mr-3" aria-hidden="true"></i>
                            <i onClick={() => reject(person._id)} className="btn fa fa-times d-inline-block float-right my-auto mr-3" aria-hidden="true"></i>
                        </div>
                    </li>
                )
            })}

        </ul>
    )
}

export default Received;
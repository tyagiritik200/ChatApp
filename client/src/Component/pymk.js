import React, { useState, useEffect } from 'react';
import logo from '../Pics/avatar.png';
import { useSelector,useDispatch } from 'react-redux';
import Axios from 'axios';
import Loading from './loading';
function PYMK(props) {
    const [pymk, setPymk] = useState([]);
    const [currname,setCurrName]=useState('');
    const token = useSelector(state => state.auth.token);
    const [loading,setLoading]=useState(true);
    const dispatch=useDispatch();
    useEffect(() => {
        setLoading(true)
        Axios({
            method: 'get',
            url: '/user/getCurrentUser',
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
        .then(user => {
            setCurrName(user.data.name);
            setPymk(user.data.pymk);
            setLoading(false);
        })
    }, [])
    const send = (id) => {
        setLoading(true);
        Axios({
            method: 'patch',
            url: '/user/addToSent/' + id,
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
            .then(result => {
                let newpymk=pymk.filter(user=>user._id!==id);
                setPymk(newpymk);
                props.socket.emit('send-notification',{note:`${currname} has sent you a request`,id})
                setLoading(false);
            })
            .catch((err) => {
                console.log('Cannot add to sent :' + err.response.data.err);
            })
    }
    return (
        <>
        {loading?<Loading/>:
        <ul className="list-group list-group-flush">
            {pymk.map(person => {
                return (
                    <li key={person._id} className="list-group-item px-2 py-2">
                        <div className="media">
                            <img className="align-self-center mr-3" src={logo} alt="Generic placeholder image" height="40px" width="40px" />
                            <div className="media-body align-self-center">
                                <h5 className="mt-0">{person.name}</h5>
                            </div>
                            <button onClick={() => send(person._id)} className="btn btn-info text-white btn-md d-inline-block float-right my-auto mr-3">Send</button>
                        </div>
                    </li>
                );
            })}
        </ul>
        }
        </>
    )
}

export default PYMK;
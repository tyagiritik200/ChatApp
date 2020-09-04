import React, { useState, useEffect,useRef } from 'react';
import '../CSS/chatContain.css';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import ScrollToBottom from 'react-scroll-to-bottom';
import Picker from 'emoji-picker-react';
import fire from '../Firebase/fire';
import Loading from './loading';
function Chatcontainer(props) {
    const [msg, changeMsg] = useState('');
    const [dispemoji, setDispEmoji] = useState(false);
    const [prevmsg, setPrevMsg] = useState([]);
    const [progress,setProgress]=useState(0);
    const [loading,setLoading]=useState(true);
    const token = useSelector(state => state.auth.token);
    const userid = props.userid;
    let fileInput=useRef();
    useEffect(() => {
        props.socket.on('accept-msg', msg => {
            if (msg.from === userid)
                setPrevMsg(prevmsg => [...prevmsg, msg]);
        })
    }, [])
    useEffect(() => {
        setLoading(true);
        Axios({
            method: 'get',
            url: '/msg/fetchMessages/' + userid,
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token
            }
        })
            .then(result => {
                setPrevMsg(result.data.messages);
                setLoading(false);
            })
            .catch(err => {
                console.log("Error in curr user " + err);
            })
    }, [])


    let sendMsg = (e,fileURL='',msgtype='text') => {
        console.log('In send msg :'+msg+" here")
        let message=msg;
        setDispEmoji(false);
        if(fileURL!='')
        {
            console.log('Image url :'+msg);
            message=fileURL;
        }
        else
        {
            message=msg;
            console.log('Else Image url :'+msg);
            e.preventDefault();
        }
        if (message !== '') {
            Axios.post('/msg/sendMessage/' + userid, {
                message,
                msgtype
            }, {
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token
                }
            })
                .then(result => {
                    setPrevMsg(prevmsg => [...prevmsg, result.data]);
                    props.socket.emit('send-chat-msg', (userid, result.data));


                    Axios.patch('/user/addlastmsg/' + userid, {
                        lastmsg:result.data
                    }, {
                        headers: {
                            "Content-type": "application/json",
                            "x-auth-token": token
                        }
                    })
                    .then(data=>{
                        console.log('Last message Updated');
                    })
                    .catch(err=>{
                        console.log('Cant update last msg');
                    })
                })
                .catch(err => {
                    console.log("Error Occured" + err);
                })

        }
        changeMsg('');
    }

    let onEmojiClick = (e, emojiObject) => {
        changeMsg(msg => msg.concat(emojiObject.emoji));
    }

    let typingMsg = (e) => {
        changeMsg(e.target.value);
    }

    function displayEmoji() {
        dispemoji ? setDispEmoji(false) : setDispEmoji(true)
    }

    const fileSelected=(e)=>{
        if(e.target.files[0])
        {
            var file=e.target.files[0];
            let uploadTask;
            if(file.type=="video/mp4")
                 uploadTask=fire.storage().ref(`videos/${file.name}`).put(file)
            else
                 uploadTask=fire.storage().ref(`images/${file.name}`).put(file)
            uploadTask.on('state_changed',
            (snapshot)=>{
                //Progress function
                const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                setProgress(progress);
            },(error)=>{
                //error function
                console.log('Error is :'+error);
            },
            ()=>{
                if(file.type=="video/mp4")
                    fire.storage().ref('videos').child(file.name).getDownloadURL().then(url=>{
                        sendMsg(null,url,"video");
                    })
                else
                    fire.storage().ref('images').child(file.name).getDownloadURL().then(url=>{
                        sendMsg(null,url,"image");
                    })
            })
        }
    }

    return (
        <>
            <div className="" id="msgfield">
            {loading?<Loading/>:
                <ScrollToBottom className="scrolltobottom">
                    
                    {prevmsg.map((item, index) => {

                        if (item.from === props.userid)
                            return (
                                <div key={index} className="msg-row other-msg">
                                    {item.msgtype=="image"?<div className='msg-text'><img src={item.msg} alt="pic" style={{height:"30vh"},{width:"30vh"}}/></div>:
                                    item.msgtype=="video"?<div className='msg-text'><video alt="video" style={{height:"30vh"},{width:"30vh"}} controls><source src={item.msg} type="video/mp4"/></video></div>:
                                    <div className='msg-text'>{item.msg}</div>}
                                    <div className='msg-time'>{moment(item.date).format("hh:mm a")}</div>
                                </div>
                            )
                        else
                            return (
                                <div key={index} className="msg-row your-msg">
                                    {item.msgtype=="image"?<div className='msg-text'><img src={item.msg} alt="pic" style={{height:"30vh"},{width:"30vh"}}/></div>:
                                    item.msgtype=="video"?<div className='msg-text'><video style={{height:"30vh"},{width:"30vh"}} controls><source src={item.msg} type="video/mp4"/></video></div>:
                                    <div className='msg-text'>{item.msg}</div>}
                                    <div className='msg-time'>{moment(item.date).format("hh:mm a")}</div>
                                </div>
                            )
                    })}
                </ScrollToBottom>
                }
                {(dispemoji) ? <div id="emojimenu">
                    <Picker onEmojiClick={onEmojiClick} />
                </div> : null}

            </div>


            <div className="bg-white text-white inpfield">
                {progress>0 && progress<100?<progress value={progress} max="100" style={{width:"150%"},{height:"60%"}}/>:
                <form method='POST' onSubmit={sendMsg}>
                    <div className="bg-secondary border border-dark d-inline-block" id='msg'>
                        <a type="button" onClick={displayEmoji}>
                            <i className="far fa-laugh text-dark mx-2"></i>
                        </a>
                        <input className="mt-1" onChange={typingMsg} onFocus={() => setDispEmoji(false)} value={msg} name='message' id='type' type='text' placeholder='Type your message' autoComplete="off" />
                        <input style={{display:"none"}}type="file" onChange={fileSelected} ref={fileInput} accept="image/png, image/jpeg, image/jpg, video/mp4"/>
                        <i onClick={()=>fileInput.current.click()} style={{ cursor: 'pointer' }} className="fas fa-upload text-dark mx-2"></i>
                    </div>
                    <button className='rounded-circle mx-1 bg-info' type='submit' id='submit'><i className="fas fa-paper-plane text-white"></i></button>
                </form>
                }
            </div>
        </>
    );
}

export default Chatcontainer;

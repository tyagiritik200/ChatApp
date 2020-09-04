import React, { useState } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SignUp } from '../Redux';
import Modal from './modal';
function Signup() {
    const err = useSelector(state => state.auth.error);
    const isLoading = useSelector(state => state.auth.isLoading);
    const dispatch = useDispatch();


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confpass, setConfPass] = useState('');

    const [checkname,setCheckName]=useState();
    const [checkemail,setCheckEmail]=useState();
    const [checkpass,setCheckPass]=useState();
    const [checkconfpass,setCheckConfPass]=useState();

    
    const changeName = (e) => {
        var name = e.target.value;
        setName(name);
        var regx = /^[a-zA-Z]\w{3,}$/;             // [a-zA-Z0-9@#$%^&*.]
        if (name.trim() == "" || !regx.test(name)) {
            setCheckName(false);
            document.getElementById('wrongname').style.display = "";
            document.getElementById('rightname').style.display = "none";
        }
        else {
            setCheckName(true);
            document.getElementById('rightname').style.display = "";
            document.getElementById('wrongname').style.display = "none";
        }
    }
    const changeEmail = (e) => {
        var email = e.target.value;
        var regx = /^[a-z0-9\._-]{3,}@[a-z]{5,}.[a-z]{2,}$/;  //. means any character and \. means . is not special
        if (email.trim() == "" || !regx.test(email)) {
            setCheckEmail(false);
            document.getElementById('wrongemail').style.display = "";
            document.getElementById('rightemail').style.display = "none";
        }
        else {
            setCheckEmail(true);
            document.getElementById('rightemail').style.display = "";
            document.getElementById('wrongemail').style.display = "none";
        }
        setEmail(email);
    }
    const changePass = (e) => {
        var pass=e.target.value;
        var regx= /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&*^.])(?=.{8,})/;
        if(pass.trim()=="" || pass.length<8  || !regx.test(pass))
        {
            setCheckPass(false);
            document.getElementById('wrongpass').style.display = "";
            document.getElementById('rightpass').style.display = "none";
        }
        else
        {
            setCheckPass(true);
            document.getElementById('rightpass').style.display = "";
            document.getElementById('wrongpass').style.display = "none";
        }
        if(confpass.length>=8)
        {
            if(pass!=confpass)
            {
                setCheckConfPass(false);
                document.getElementById('wrongconfpass').style.display = "";
                document.getElementById('rightconfpass').style.display = "none";
            }
            else
            {
                setCheckConfPass(true);
                document.getElementById('rightconfpass').style.display = "";
                document.getElementById('wrongconfpass').style.display = "none";
            }
            
        }
        setPass(pass);
    }
    const changeConfPass = (e) => {
        var confpass=e.target.value;
        var regx= /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&*^.])(?=.{8,})/;
        if(confpass.trim()=="" || confpass.length<8  || !regx.test(confpass) || confpass!=pass)
        {
            setCheckConfPass(false);
            document.getElementById('wrongconfpass').style.display = "";
            document.getElementById('rightconfpass').style.display = "none";
        }
        else
        {
            setCheckConfPass(true);
            document.getElementById('rightconfpass').style.display = "";
            document.getElementById('wrongconfpass').style.display = "none";
        }
        setConfPass(confpass);

    }
    const submitUser = (e) => {
        e.preventDefault();
        if(checkname && checkemail && checkpass && checkconfpass)
        {
            const user = {
                name,
                email,
                pass,
                confpass
            }
            dispatch(SignUp(user));
        }   
        else
            console.log('wrong');
        
    }
    const error = <Modal message={err.name} alert='danger' />
    const loading = <Modal message="...Loading" alert='primary' />
    return (
        <>
            <div style={{ textAlign: 'justify' }, { marginTop: '0%' }} className="container mx-xs-auto">
                <div className="card border border-info" style={{ width: '90vh' }}>
                    <div className="card-header bg-info text-white">SIGNUP</div>
                    <div className="card-body">
                        {isLoading ? loading : null}
                        {err ? error : null}
                        <form method="POST" onSubmit={submitUser}>
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">NAME:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="name" onChange={changeName} value={name} id="name" type="text" placeholder="Enter your Name" title="must start with a letter and length must be >3" required />
                                    <i id="wrongname" className="fas fa-times-circle" style={{ color: "red", display: "none" }}></i>
                                    <i id="rightname" className="fas fa-check-circle" style={{ color: "green", display: "none" }}></i>
                                </div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">EMAIL:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="email" onChange={changeEmail} value={email} id="email" type="email" placeholder="Enter your Email" title="must be a valid email id" required />
                                    <i id="wrongemail" className="fas fa-times-circle" style={{ color: "red", display: "none" }}></i>
                                    <i id="rightemail" className="fas fa-check-circle" style={{ color: "green", display: "none" }}></i>
                                </div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">PASSWORD:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="pass" onChange={changePass} value={pass} id="pass" type="password" placeholder="Enter your password" title="must contain 1 uppercase, 1 lowercase, 1 digit, 1 special character" required />
                                    <i id="wrongpass" className="fas fa-times-circle" style={{ color: "red", display: "none" }}></i>
                                    <i id="rightpass" className="fas fa-check-circle" style={{ color: "green", display: "none" }}></i>
                                </div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">CONFIRM PASSWORD:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="confpass" onChange={changeConfPass} value={confpass} id="confpass" type="password" placeholder="Enter your password" title="must contain 1 uppercase, 1 lowercase, 1 digit, 1 special character" required />
                                    <i id="wrongconfpass" className="fas fa-times-circle" style={{ color: "red", display: "none" }}></i>
                                    <i id="rightconfpass" className="fas fa-check-circle" style={{ color: "green", display: "none" }}></i>
                                </div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="col-sm-12 text-center"><input className="bg-info border border-primary text-white" type="submit" value="SIGNUP" /></div>
                            </div>
                            <p>Already have an account? <Link to="/">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
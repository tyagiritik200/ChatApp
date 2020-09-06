import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, SignUp } from '../Redux';
import Modal from './modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import Axios from 'axios';
import '../CSS/login.css';
function Login() {

    const err = useSelector(state => state.auth.error);
    const isLoading = useSelector(state => state.auth.isLoading);

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const dispatch = useDispatch();
    const submitLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, pass));
    }
    const error = <Modal message={err} alert='danger' />
    const loading = <Modal message="...Loading" alert='primary' />


    const responseGoogle = (response) => {
        if(response.profileObj){
            const user = {
                name: response.profileObj.name,
                email: response.profileObj.email,
                pass: response.profileObj.googleId,
                confpass: response.profileObj.googleId
            }
            loginAction(user);
        }   
    }
    const responseFacebook=(response)=>{
        const user={
            name:response.name,
            email:response.email,
            pass:response.id,
            confpass:response.id,
        }
        loginAction(user);
    }

    const loginAction=(user)=>{
        dispatch({
            type:'USER_LOADING'
        })
        Axios.get('/user/getUserByEmail/' + user.email)
            .then(result => {
                if (!result.data.exists) {
                    dispatch({
                        type:'USER_LOADING'
                    })
                    Axios.post('/user/addNewUser', {
                        name:user.name,
                        email:user.email,
                        pass:user.pass,
                        confpass:user.confpass,
                        google:true
                    })
                        .then(data => {
                            dispatch(loginUser(user.email,user.pass,true));  
                        })
                        .catch(err => {
                            dispatch({
                                type: 'SIGNUP_FAILED',
                                payload: {
                                    err: err.response.data.err
                                }
                            })
                        })
                }
                else
                    dispatch(loginUser(user.email,user.pass,true));  
            })
    }

    return (
        <>
            <div style={{ textAlign: 'justify' }, { marginTop: '0%' }} className="container mx-xs-auto">
                <div className="card border border-info" style={{ width: '80vh' }}>
                    <div className="card-header bg-info text-white">LOGIN</div>
                    <div className="card-body">
                        {isLoading ? loading : null}
                        {err ? error : null}
                        <form method="POST" onSubmit={submitLogin}>
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">Email:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="email" onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="email" placeholder="Enter your Email" title="must be a valid email id" required /></div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">PASSWORD:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="pass" onChange={(e) => setPass(e.target.value)} value={pass} id="pass" type="password" placeholder="Enter your password" title="must contain 1 uppercase, 1 lowercase, 1 digit, 1 special character" required /></div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="col-sm-12 text-center"><input className="bg-info border border-primary text-white" type="submit" value="LOGIN" /></div>
                            </div>
                            {/* <div className="row fmrw">
                                <div className="col-sm-12 text-center"><Link to="/forgot">Forgot Password?</Link></div>
                            </div> */}
                            <p>Don't have an account? <Link to="/signup">SignUp</Link></p>
                        </form>
                        <div className="row">
                            <div className="col-6">
                        <GoogleLogin className="bg-primary text-white google"
                            clientId="479349081907-r5iken7250jmkgg61b0va28h4tqthg2c.apps.googleusercontent.com"
                            buttonText="Sign In With Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        </div>
                        <div className="col-6">
                        <FacebookLogin className="bg-primary"
                            appId="1022911358150079"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={responseFacebook}
                        />
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
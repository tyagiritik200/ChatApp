import React, { useState } from 'react';
import Axios from 'axios';
import Modal from './modal';

function VerifyOTP() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [load, setLoad] = useState(false);
    const [err, setErr] = useState(false);
    const [succ, setSucc] = useState(false);
    const [otp, setOtp] = useState('');
    const [accVerified, setAccVerified] = useState(false);
    const submitVerify = (e) => {
        e.preventDefault();
        setLoad(true);
        Axios.get('/user/getUserByEmail/' + email)
            .then(result => {
                if (result.data.exists) {
                    setLoad(false);
                    setAccVerified(true);
                    setSucc(true);
                    setErr(false);
                    document.getElementById('name').disabled = true;
                    document.getElementById('email').disabled = true;


                   Axios.post('/pass/sendOtp',email)
                   .then(output=>{
                        console.log("Output is :"+output);
                   })
                   .catch(error=>{
                       console.log('Error is :'+error);
                   })



                }
                else {
                    setLoad(false);
                    setErr(true);
                    setSucc(false);
                }
            })
    }
    const success = <Modal message="OTP has been successfully sent to your Email Id" alert='success' />
    const error = <Modal message="Sorry!!! This Email Id doesn't exists" alert='danger' />
    const loading = <Modal message="...Loading" alert='primary' />
    return (
        <>
            <div style={{ textAlign: 'justify' }, { marginTop: '0%' }} className="container mx-xs-auto">
                <div className="card border border-info" style={{ width: '80vh' }}>
                    <div className="card-header bg-info text-white">Change Password</div>
                    <div className="card-body">
                        {load ? loading : null}
                        {err ? error : null}
                        {succ ? success : null}
                        <form method="POST" onSubmit={submitVerify}>
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">USERNAME:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="name" onChange={(e) => setName(e.target.value)} value={name} id="name" type="text" placeholder="Enter your Name" title="must begin with a letter and length should be atleast 3" required /></div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="offset-sm-1 col-sm-4">EMAIL:</div>
                                <div className="col-sm-6 offset-sm-1"><input name="email" onChange={(e) => setEmail(e.target.value)} value={email} id="email" type="email" placeholder="Enter your Email" title="must be a valid email id" required /></div>
                            </div>
                            <br />
                            <div className="row fmrw">
                                <div className="col-sm-12 text-center"><input className="bg-info border border-primary text-white" type="submit" value="Verify Account" /></div>
                            </div>
                        </form>
                        <br /><br />
                        {accVerified ?
                            <>
                                <div className="row fmrw">
                                    <div className="offset-sm-1 col-sm-4">Enter OTP:</div>
                                    <div className="col-sm-6 offset-sm-1"><input name="OTP" onChange={(e) => setOtp(e.target.value)} value={otp} id="otp" type="text" placeholder="Enter OTP" title="must be number only" required /></div>
                                </div>
                                <br />
                                <div className="row fmrw">
                                    <div className="col-sm-12 text-center"><input className="bg-info border border-primary text-white" type="submit" value="Verify OTP" /></div>
                                </div>
                            </>
                            : null}
                    </div>
                </div>
            </div>

        </>
    );
}

export default VerifyOTP;
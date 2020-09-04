const express=require('express');
const Router=express.Router();
const config = require("../Config/key");
const userModel=require('../Models/users');
const Authentication=require('../Controller/auth');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {namevalid,passvalid,confpassvalid,emailvalid}= require('../Controller/formValid'); 


var SECRET=config.SECRET;

Router.post('/addNewUser',(req,res,next)=>{
    const { name, email, pass, confpass, google } = req.body;
    console.log('Google is :'+google);
    if(!google && (!namevalid(name) || !passvalid(pass) || !confpassvalid(pass,confpass) || !emailvalid(email)))
        res.status(400).json({err:'Provide Valid Credentials'});
    else{
    userModel.find({},{name:1})
    .then(data=>{
        var newUser=new userModel({
            name,
            email,
            pass,
            pymk:data
        })
        bcrypt.hash(pass, 10, (err, hash) => {
            if (err) throw err;
            newUser.pass = hash;
        newUser.save()
        .then(newdata=>{
            let newentry={
                _id:newdata._id,
                name:newdata.name,
            }
            userModel.updateMany({"_id":{$ne:newentry._id}},{$push:{"pymk":newentry}})
            .then(result=>{
                console.log('Updated');
            })
            .catch(err2=>{
                res.status(404).json({err:'Other Users PYMK cannot be updated'});
            })
            res.status(200).json({msg:'New User added successfully',data:newdata});
        })
        .catch(err=>{
            res.status(404).json({err:err});
        })
        })
    })
    .catch(err=>{
        res.status(404).json({err:'Cannot Find Other Users'});
    })
    }
})

Router.get('/getUserByEmail/:email',(req,res,next)=>{
    var email=req.params.email;
    userModel.findOne({email:email},{name:1})
    .then(result=>{
        if(result)
            res.status(200).json({exists:true})
        else
            res.status(200).json({exists:false})
    })
    .catch(err=>{
        res.status(404).json({error:err});
    })
})

Router.post('/login', (req, res, next) => {
    const { email, pass,google } = req.body;
    console.log('Google login :'+google);
    if( !google && (!passvalid(pass) || !emailvalid(email)))
        res.status(400).json({err:'Provide Valid Credentials'});
    else{
    userModel.findOne({ email: email })
        .then(result => {
            if (!result)
                res.status(400).json({ err: 'Invalid Credentials' });
            else {
                bcrypt.compare(pass, result.pass)
                    .then(isMatched => {
                        if (!isMatched)
                            res.status(400).json({ err: 'Invalid Credentials' });
                        else {
                            jwt.sign(
                                { id: result._id },
                                SECRET,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.status(200).json({
                                        token,
                                        msg: 'Successfully logged in',
                                        user: {
                                            id: result._id,
                                            name: result.name
                                        }
                                    })
                                }
                            )
                        }
                    })
            }
        })
    }
})



Router.get('/getUsers',(req,res,next)=>{
    userModel.find({})
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err=>{
        res.status(401).json({err:'Error occured'});
    })
})


Router.get('/getCurrentUser',Authentication,(req,res,next)=>{
    let id=req.user.id;
    userModel.findById(id)
    .then(data=>{
        if(!data)
            res.status(401).json({err:'User Not Present'});
        else
            res.status(200).json(data);
    })
    .catch(err=>{
        res.status(401).json({err:'Error occured'});
    })
})


Router.patch('/addToSent/:new',Authentication,(req,res,next)=>{
    let currId=req.user.id;
    let newId=req.params.new;
    userModel.findById(newId,{name:1})
    .then(data=>{
        userModel.findByIdAndUpdate(currId,{$push:{"notifications":{$each:[`You have sent a request to ${data.name}`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(currId,{$push:{"sent":data}})
        .then(result=>console.log('Sent Done'))
        userModel.findByIdAndUpdate(currId,{$pull:{"pymk":{"_id":data._id}}})
        .then(result=>console.log('Sent PYMK Pull Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    userModel.findById(currId,{name:1})
    .then(data=>{
        userModel.findByIdAndUpdate(newId,{$push:{"notifications":{$each:[`${data.name} has sent you a request`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(newId,{$push:{"received":data}})
        .then(out=>console.log('Received Done'))
        userModel.findByIdAndUpdate(newId,{$pull:{"pymk":{"_id":data._id}}})
        .then(out=>console.log('Sent PYMK Pull Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    res.status(200).json({success:"Operations performed successfully"});

})


Router.patch('/acceptReceived/:other',Authentication,(req,res,next)=>{
    let currId=req.user.id;
    let newId=req.params.other;
    userModel.findById(newId,{name:1})
    .then(data=>{
        let newdata={
            _id:data._id,
            name:data.name,
            lastmsg:{}
        }
        userModel.findByIdAndUpdate(currId,{$push:{"notifications":{$each:[`You have accepted request from ${data.name}`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(currId,{$pull:{"received":{"_id":data._id}}})
        .then(result=>console.log('Received Accept Done'))
        userModel.findByIdAndUpdate(currId,{$push:{"contacts":newdata}})
        .then(result=>console.log('Received Contact Push Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    userModel.findById(currId,{name:1})
    .then(data=>{
        let newdata={
            _id:data._id,
            name:data.name,
            lastmsg:{}
        }
        userModel.findByIdAndUpdate(newId,{$push:{"notifications":{$each:[`${data.name} has accepted your request`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(newId,{$push:{"contacts":newdata}})
        .then(result=>console.log('Sent Contact Push Done'))
        userModel.findByIdAndUpdate(newId,{$pull:{"sent":{"_id":data._id}}})
        .then(result=>console.log('Sent Pull Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    res.status(200).json({msg:"Added to Contacts performed successfully"});
})


Router.patch('/cancelReceived/:other',Authentication,(req,res,next)=>{
    let currId=req.user.id;
    let newId=req.params.other;
    userModel.findById(newId,{name:1})
    .then(data=>{
        userModel.findByIdAndUpdate(currId,{$push:{"notifications":{$each:[`You have rejected request from ${data.name}`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(currId,{$pull:{"received":{"_id":data._id}}})
        .then(result=>console.log('Received Cancel Done'))
        userModel.findByIdAndUpdate(currId,{$push:{"pymk":data}})
        .then(result=>console.log('Received PYMK Push Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    userModel.findById(currId,{name:1})
    .then(data=>{
        userModel.findByIdAndUpdate(newId,{$push:{"notifications":{$each:[`${data.name} has rejected your request`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(newId,{$push:{"pymk":data}})
        .then(result=>console.log('Received Done'))
        userModel.findByIdAndUpdate(newId,{$pull:{"sent":{"_id":data._id}}})
        .then(result=>console.log('Sent PYMK Pull Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    res.status(200).json({msg:"Cancel Received performed successfully"});
})

Router.patch('/cancelSent/:other',Authentication,(req,res,next)=>{
    let currId=req.user.id;
    let newId=req.params.other;
    userModel.findById(newId,{name:1})
    .then(data=>{
        userModel.findByIdAndUpdate(currId,{$push:{"notifications":{$each:[`You have retracted your request to ${data.name}`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(currId,{$pull:{"sent":{"_id":data._id}}})
        .then(result=>console.log('Sent Cancel Done'))
        userModel.findByIdAndUpdate(currId,{$push:{"pymk":data}})
        .then(result=>console.log('Sent PYMK Push Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    userModel.findById(currId,{name:1})
    .then(data=>{
        userModel.findByIdAndUpdate(newId,{$push:{"notifications":{$each:[`${data.name} has retracted his request`],$position: 0}}})
        .then(result=>console.log('Notification Done'))
        userModel.findByIdAndUpdate(newId,{$push:{"pymk":data}})
        .then(result=>console.log('Received PYMK push done Done'))
        userModel.findByIdAndUpdate(newId,{$pull:{"received":{"_id":data._id}}})
        .then(result=>console.log('Received Pull Done'))
    })
    .catch(err=>{
        res.status(404).json({err:'Error Occured'});
    })
    res.status(200).json({msg:"Cancel Sent performed successfully"});
})

Router.patch('/addlastmsg/:other',Authentication,(req,res,next)=>{
    var curr=req.user.id;
    var other=req.params.other;
    var lastmsg=req.body.lastmsg;
    userModel.findById(curr)
    .then(result=>{
        let to=result.contacts.find(ans=>ans._id==other);
        let ind=result.contacts.findIndex(ans=>ans._id==other);
        let newobject={
            _id:to._id,
            name:to.name,
            lastmsg:lastmsg
        }
        result.contacts.splice(ind,1,newobject);
        userModel.findByIdAndUpdate(curr,{$set:{contacts:result.contacts}})
        .then(final=>{
            console.log("Done");
        })
    })
    .catch(err=>{
        res.status(404).json({err:"cant done"});
    })

    userModel.findById(other)
    .then(result=>{
        let to=result.contacts.find(ans=>ans._id==curr);
        let ind=result.contacts.findIndex(ans=>ans._id==curr);
        let newobject={
            _id:to._id,
            name:to.name,
            lastmsg:lastmsg
        }
        result.contacts.splice(ind,1,newobject);
        userModel.findByIdAndUpdate(other,{$set:{contacts:result.contacts}})
        .then(final=>{
            console.log("Done");
        })
    })
    .catch(err=>{
        res.status(404).json({err:"cant done"});
    })
    res.status(200).json({succes:"done"});

})


Router.get('/getNotifications',Authentication,(req,res,next)=>{
    let id=req.user.id;
    userModel.findById(id,{notifications:1})
    .then(data=>{
        if(!data)
            res.status(401).json({err:'User Not Present'});
        else
            res.status(200).json(data);
    })
    .catch(err=>{
        res.status(401).json({err:'Error occured'});
    })
})

Router.delete('/deleteAll',(req,res,next)=>{
    userModel.remove({})
    .then(data=>{
        res.status(200).json({msg:"All Users Deleted"});
    })
})


module.exports=Router;



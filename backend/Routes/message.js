const express=require('express');
const Router=express.Router();
const messageModel=require('../Models/messages');
const Authentication=require('../Controller/auth');
Router.get('/',(req,res,next)=>{
    res.send('Hello');
})

Router.get('/fetchMessages/:other',Authentication,(req,res,next)=>{
    const from=req.user.id;
    const to=req.params.other;
    messageModel.find({$or:[{$and:[{from:from},{to:to}]},{$and:[{from:to},{to:from}]}]})
    .then(data=>{
        res.status(200).json({messages:data});
    })
    .catch(err=>{
        res.status(404).json(err);
    })
})

Router.post('/sendMessage/:other',Authentication,(req,res,next)=>{
    const send=new messageModel({
        from:req.user.id,
        to:req.params.other,
        msg:req.body.message,
        msgtype:req.body.msgtype
    })
    send.save()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        
    })
})

Router.delete('/deleteAllMessages',(req,res,next)=>{
    messageModel.remove({})
    .then(success=>{
        res.status(200).json('All msgs deleted');
    })
    .catch(err=>{
        res.status(404).json('Error is '+err);
    })
})

module.exports=Router;
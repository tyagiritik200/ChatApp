const express=require('express');
const userModel=require('../Models/users');


exports.get_user_by_mail=(req,res,next)=>{
    var email=req.params.email;
    userModel.findOne({email:email},{name:1})
    .then(result=>{
        if(result)
            res.status(200).json({exists:true,user:result})
        else
            res.status(200).json({exists:false,user:result})
    })
    .catch(err=>{
        res.status(404).json({error:err});
    })
}

exports.get_current_user=(req,res,next)=>{
    let id=req.user.id;
    userModel.findById(id,{pass:0})
    .then(data=>{
        if(!data)
            res.status(401).json({err:'User Not Present'});
        else
            res.status(200).json(data);
    })
    .catch(err=>{
        res.status(401).json({err:'Error occured'});
    })
}


exports.send_request=(req,res,next)=>{
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

}


exports.accept_request=(req,res,next)=>{
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
}


exports.cancel_received_request=(req,res,next)=>{
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
}


exports.cancel_sent_request=(req,res,next)=>{
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
}


exports.add_last_message=(req,res,next)=>{
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
            console.log("Sender last msg Done");
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
            console.log("Receiver last msg done");
        })
    })
    .catch(err=>{
        res.status(404).json({err:"cant done"});
    })
    res.status(200).json({succes:"done"});

}


exports.get_notifications=(req,res,next)=>{
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
}
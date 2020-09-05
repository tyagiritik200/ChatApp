const express=require('express');
const Router=express.Router();
const Authentication=require('../Controller/auth');
const {add_new_user, login} =require('../Controller/userEntryController');
const {get_user_by_mail, get_current_user, send_request, accept_request, cancel_received_request, cancel_sent_request, add_last_message, get_notifications}=require('../Controller/userDetailsController');


Router.post('/addNewUser',add_new_user)

Router.get('/getUserByEmail/:email',get_user_by_mail)

Router.post('/login',login)


//Authenticated routes


Router.get('/getCurrentUser',Authentication,get_current_user)


Router.patch('/addToSent/:new',Authentication,send_request)


Router.patch('/acceptReceived/:other',Authentication,accept_request)


Router.patch('/cancelReceived/:other',Authentication,cancel_received_request)

Router.patch('/cancelSent/:other',Authentication,cancel_sent_request)

Router.patch('/addlastmsg/:other',Authentication,add_last_message)


Router.get('/getNotifications',Authentication,get_notifications)



module.exports=Router;



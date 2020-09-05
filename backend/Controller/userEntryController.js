var express = require('express');
const config = require("../Config/key");
const userModel=require('../Models/users');

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {namevalid,passvalid,confpassvalid,emailvalid}= require('./formValid'); 

var SECRET=config.SECRET;


exports.add_new_user = (req, res, next) => {
    const { name, email, pass, confpass, google } = req.body;
    console.log('Google is :' + google);
    if (!google && (!namevalid(name) || !passvalid(pass) || !confpassvalid(pass, confpass) || !emailvalid(email)))
        res.status(400).json({ err: 'Provide Valid Credentials' });
    else {
        userModel.find({}, { name: 1 })
            .then(data => {
                var newUser = new userModel({
                    name,
                    email,
                    pass,
                    pymk: data
                })
                bcrypt.hash(pass, 10, (err, hash) => {
                    if (err) throw err;
                    newUser.pass = hash;
                    newUser.save()
                        .then(newdata => {
                            let newentry = {
                                _id: newdata._id,
                                name: newdata.name,
                            }
                            userModel.updateMany({ "_id": { $ne: newentry._id } }, { $push: { "pymk": newentry } })
                                .then(result => {
                                    console.log('Updated');
                                })
                                .catch(err2 => {
                                    res.status(404).json({ err: 'Other Users PYMK cannot be updated' });
                                })
                            res.status(200).json({ msg: 'New User added successfully', data: newdata });
                        })
                        .catch(err => {
                            res.status(404).json({ err: err });
                        })
                })
            })
            .catch(err => {
                res.status(404).json({ err: 'Cannot Find Other Users' });
            })
    }
}




exports.login = (req, res, next) => {
    const { email, pass, google } = req.body;
    console.log('Google login :' + google);
    if (!google && (!passvalid(pass) || !emailvalid(email)))
        res.status(400).json({ err: 'Provide Valid Credentials' });
    else {
        userModel.findOne({ email: email })
            .then(result => {
                if (!result)
                    res.status(400).json({ err: 'Invalid Credentials' });
                else {
                    console.log(result);
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
}
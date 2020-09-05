const express = require('express');
const Router = express.Router();
const mailjet = require('node-mailjet')
    .connect('c056b67158d2500bba4ad5d1b29fba73', '39a0196f02fe7f501be987c0ebe6fd7d')

Router.post('/sendOtp', (req, res, next) => {
    var email = req.body.email;
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "the12thman200@gmail.com",
                        "Name": "Ritik"
                    },
                    "To": [
                        {
                            "Email": "tyagiritik200@gmail.com",
                            "Name": "Ritik"
                        }
                    ],
                    "Subject": "Greetings from Mailjet.",
                    "TextPart": "My first Mailjet email",
                    "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body)
            res.status(200).json({success:"done"})
        })
        .catch((err) => {
            console.log(err)
            res.status(200).json({error:"err"})
        })

})

module.exports=Router;
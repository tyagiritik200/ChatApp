var mongoose=require('mongoose');

var messageSchema=new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true,
    },
    msg:{
        type:String,
        required:true
    },
    msgtype:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var messageModel=new mongoose.model('message',messageSchema);

module.exports=messageModel;
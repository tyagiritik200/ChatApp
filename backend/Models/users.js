var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    pass:{
        type:String,
        required:true
    },
    contacts:{
        type:Array,
        required:false,
    },
    pymk:{
        type:Array,
        required:false,
    },
    received:{
        type:Array,
        required:false,
    },
    sent:{
        type:Array,
        required:false,
    },
    notifications:{
        type:Array,
        required:false,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var userModel=new mongoose.model('ChatUsers',userSchema);

module.exports=userModel;
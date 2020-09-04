const namevalid = (name) => {
    var regx = /^[a-zA-Z]\w{2,}$/;             // [a-zA-Z0-9@#$%^&*.]
    if (name.trim() == "" || !regx.test(name)) {
        return false;
    }
    else {
        return true;
    }
}

const emailvalid = (email) => {
    var regx = /^[a-z0-9\._-]{3,}@[a-z]{5,}.[a-z]{2,}$/;  //. means any character and \. means . is not special
    if (email.trim() == "" || !regx.test(email)) {
        return false;
    }
    else {
        return true;
    }
}

const passvalid = (pass) => {
    var regx = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&*^.])(?=.{8,})/;
    if (pass.trim() == "" || pass.length < 8 || !regx.test(pass)) {
        return false;
    }
    else {
        return true;
    }
}

const confpassvalid=(pass,confpass)=>{
    var regx = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%&*^.])(?=.{8,})/;
    if (confpass.trim() == "" || confpass.length < 8 || !regx.test(confpass) || confpass!=pass) {
        return false;
    }
    else {
        return true;
    }
}

module.exports={namevalid,emailvalid,passvalid,confpassvalid}
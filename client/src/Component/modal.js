import React from 'react';

function Modal(props) {
    var alert=props.alert;
    if (props.message === '')
        return (<></>);
    else
        return (
            <div className={"alert alert-"+{alert}.alert+" alert-dismissible fade show"} role="alert">
                {props.message==='MongoError'?'Email Id already exists':props.message}
            </div>
        )
}

export default Modal;
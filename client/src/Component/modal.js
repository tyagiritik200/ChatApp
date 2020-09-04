import React from 'react';

function Modal(props) {
    var alert=props.alert;
    if (props.message === '')
        return (<></>);
    else
        return (
            <div className={"alert alert-"+{alert}.alert+" alert-dismissible fade show"} role="alert">
                {props.message==='MongoError'?'Email Id already exists':props.message}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        )
}

export default Modal;
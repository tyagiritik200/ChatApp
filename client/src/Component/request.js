import React from 'react';
import Received from './received';
import Sent from './sent';
function Request(props) {
    return (
        <div id="accordion" className='container mt-2'>
            <div className="card mt-3">
                <div className="card-header" id="headingOne">
                    <h5 className="mb-0">
                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Received
                    </button>
                    </h5>
                </div>

                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                    <div className="card-body p-0">
                        <Received socket={props.socket}/>
                    </div>
                </div>
            </div>
            <div className="card mt-3">
                <div className="card-header" id="headingTwo">
                    <h5 className="mb-0">
                        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Sent
                    </button>
                    </h5>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                    <div className="card-body p-0">
                        <Sent socket={props.socket}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Request;
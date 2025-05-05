import React from 'react';

function Button(props) {
    return (
        <button type="button" className="btn btn-primary btn-lg px-4 gap-3 blue-bg">{props.text}</button>
    );
}

export default Button;
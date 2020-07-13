import React from 'react';

export default function ({id, buttonType, buttonClass = '', buttonLabel, disabled, onClick}) {
    return (
        <button id={id} type={buttonType} className={`btn ${buttonClass}`} onClick={onClick} disabled={disabled}>
            {buttonLabel}
        </button>
    );
}

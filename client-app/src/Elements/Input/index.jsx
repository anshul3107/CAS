import React from 'react';
import './style.scss';

export default function ({
    id = '',
    wrapClass = '',
    labelData = '',
    labelClass = '',
    valueData = '',
    valueClass = '',
    valueType = 'text',
    isDisabled = false,
    errMessage = '',
    onChange = (event) => console.log(event.target.value)
}) {
    return (
        <div className={`input mb-2 ${wrapClass}`}>
            <div className={`position-absolute ${labelClass} ${labelData.startsWith('*') ? 'ml-1' : 'ml-2 pl-2'}`}>
                {labelData}
            </div>
            <input
                id={id}
                type={valueType}
                disabled={isDisabled}
                className={`${errMessage ? 'border-error' : 'border'} box w-100 ${valueClass}`}
                value={valueData}
                onChange={onChange}
            />
            <div className='d-flex justify-content-end'>
                {errMessage && <span className='font-smaller font-italic text-error'>{errMessage}</span>}
            </div>
        </div>
    );
}

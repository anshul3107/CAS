import React from 'react';

import './style.scss';

export default function ({wrapClass = '', fieldData = '', fieldClass = '', valueData = '', valueClass = ''}) {
    return (
        <div className={`d-flex ${wrapClass}`}>
            <span className={`${fieldClass} col-3 pr-0`}>
                <strong>{fieldData}</strong>
            </span>
            {valueData && <span className={`${valueClass} col-9 pl-0`}>{valueData}</span>}
        </div>
    );
}

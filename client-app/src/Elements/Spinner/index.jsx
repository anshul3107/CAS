import React from 'react';

import './style.scss';

export default function ({isLoading}) {
    return (
        <>
            {isLoading && (
                <div className='loading-spinner'>
                    <div className='dual-ring' />
                </div>
            )}
        </>
    );
}

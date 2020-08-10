import React from 'react';

import image404 from './404.png';

export default function () {
  return (
    <div className='d-flex justify-content-center align-items-center'>
      <div className='mw-100'>
        <img alt='PageNotFound' src={image404} className='w-100' />
        <div className='text-center mx-3'>
          <span>Uh Oh! Looks like someone pulled the plug on this page and missed a connection.</span>
          <br />
        </div>
      </div>
    </div>
  );
}

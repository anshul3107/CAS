import React from 'react';
import {Link, useLocation} from 'react-router-dom';

import './style.scss';

export default function (props) {
    const authData = JSON.parse(window.sessionStorage.getItem('authData'));
    const isLoggedin = authData && authData.authToken ? true : false;

    const location = useLocation().pathname;
    const homePage = location === '/home';

    return (
        <div
            className={`header d-flex mb-5 py-2 px-3 ${!homePage ? 'justify-content-between' : 'justify-content-end'}`}>
            {!homePage && (
                <Link to='/home' className='d-flex align-content-center'>
                    <span className='material-icons text-grey mx-2'>home</span>Home
                </Link>
            )}
            <div className='text-black mx-2'>
                {isLoggedin ? (
                    <div>Hi {authData.name}</div>
                ) : (
                    <div className='d-flex align-content-center'>
                        <span className='mx-2'>
                            <Link to='/user/login'>Sign In</Link>
                        </span>
                        <span>/</span>
                        <span className='mx-2'>
                            <Link to='/user/register'>Sign Up</Link>
                        </span>
                        <span className='material-icons text-grey'>account_circle</span>
                    </div>
                )}
            </div>
        </div>
    );
}

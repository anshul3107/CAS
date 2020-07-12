import React from 'react';
import {Link, useLocation} from 'react-router-dom';

import './style.scss';

export default function (props) {
    const authData = JSON.parse(window.localStorage.getItem('authData'));
    const isLoggedin = authData && authData.authToken ? true : false;

    const location = useLocation().pathname;
    const homePage = location === '/home';
    const verificationPage = location === '/verify/token';

    const showHeader = !verificationPage;

    return (
        <>
            {showHeader && (
                <div
                    className={`header d-flex mb-5 py-2 px-3 ${
                        !homePage ? 'justify-content-between' : 'justify-content-end'
                    }`}>
                    {!homePage && (
                        <Link to='/home' className='d-flex align-content-center'>
                            <span className='material-icons text-grey mx-2'>home</span>Home
                        </Link>
                    )}
                    <div className='text-black mx-2'>
                        {isLoggedin ? (
                            <Link to='/user/profile' className='d-flex align-content-center cursor-pointer'>
                                Hi {authData.name}
                                <span className='mx-2 material-icons text-grey'>account_circle</span>
                            </Link>
                        ) : (
                            <div className='d-flex align-content-center'>
                                <span className='mx-2'>
                                    <Link to='/user/login'>Sign In</Link>
                                </span>
                                <span>/</span>
                                <span className='mx-2'>
                                    <Link to='/user/register'>Sign Up</Link>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

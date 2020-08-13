import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

import './style.scss';
import {checkLogin} from '../../helper/checkLogin';

export default function (props) {
    const authData = JSON.parse(window.localStorage.getItem('authData'));
    const isLoggedin = authData && authData.authToken ? true : false;

    const location = useLocation().pathname;
    const verificationPage = location === '/verify/token';

    const showHeader = !verificationPage;

    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            {checkLogin()}
            {showHeader && (
                <div className={'header d-flex mb-5 py-2 px-3 justify-content-between'}>
                    <span className='px-3'>
                        <i>Courier Booking Application</i>
                    </span>
                    <div className='text-black mx-2'>
                        {isLoggedin ? (
                            <div className='position-relative'>
                                <span
                                    className='d-flex align-content-center cursor-pointer'
                                    onClick={() => setShowMenu(!showMenu)}>
                                    Hey {authData.name}
                                    <span className='mx-2 material-icons text-grey'>account_circle</span>
                                </span>
                                {showMenu && (
                                    <div className='header-menu position-absolute mt-2 z-100'>
                                        <Link
                                            to='/user/profile'
                                            onClick={() => setShowMenu(!showMenu)}
                                            className='d-flex align-content-center cursor-pointer mt-2 shaded-underline w-fit hover-bold-black'>
                                            Profile
                                        </Link>
                                        <Link
                                            to='/order/list'
                                            onClick={() => setShowMenu(!showMenu)}
                                            className='d-flex align-content-center cursor-pointer mt-2 shaded-underline w-fit hover-bold-black'>
                                            Orders
                                        </Link>
                                        <span
                                            onClick={() => {
                                                window.localStorage.removeItem('authData');
                                                window.location = '/user/login';
                                                setShowMenu(!showMenu);
                                            }}
                                            className='d-flex align-content-center cursor-pointer mt-2 shaded-underline w-fit hover-bold-black'>
                                            Sign-out
                                            <span className='ml-2 material-icons text-grey'>login</span>
                                        </span>
                                    </div>
                                )}
                            </div>
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

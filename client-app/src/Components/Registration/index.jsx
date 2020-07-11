import React, {useState} from 'react';
import RegistrationForm from './subComponents/RegistrationForm';

import API from '../../helper/api';
import {Redirect, Link} from 'react-router-dom';
import {Spinner} from '../../Elements';

export default function () {
    const [isLoading, setIsLoading] = useState(false);

    const authData = JSON.parse(window.sessionStorage.getItem('authData'));
    const isAlreadyLoggedin = authData && authData.authToken ? true : false;
    const [isRegistered, setIsRegistered] = useState(false);

    const onSubmit = (user) => {
        setIsLoading(true);
        API.post('/api/user/registration', user).then((res) => {
            setIsRegistered(true);
            setIsLoading(false);
        });
    };

    const logout = () => {
        window.sessionStorage.removeItem('authData');
    };

    return (
        <>
            <Spinner isLoading={isLoading} />
            {isAlreadyLoggedin ? (
                <p className='alert alert-info mx-3'>
                    {`Hey ${authData && authData.name}, Seems like you're already Logged In. Please `}
                    <Link onClick={logout}>
                        <strong>Sign Out</strong>
                    </Link>
                    {' first to Create another account.'}
                </p>
            ) : (
                <RegistrationForm onSubmit={onSubmit} />
            )}
            {isRegistered && <Redirect to='/home' />}
        </>
    );
}

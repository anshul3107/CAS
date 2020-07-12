import React, {useEffect, useState} from 'react';

import UserProfile from './subComponents/UserProfile';
import ContactDetails from './subComponents/ContactDetails';
import {Spinner} from '../../Elements';
import API from '../../helper/api';

export default function () {
    const [profile, setProfile] = useState({});
    const [isLoading, setLoading] = useState({});

    const authData = JSON.parse(window.localStorage.getItem('authData'));
    const authToken = authData && authData.authToken;

    useEffect(() => {
        setLoading(true);
        API.get('/api/user/profile').then((res) => {
            setProfile(res);
            setLoading(false);
        });
    }, [authToken]);

    useEffect(() => {
        if (profile.code && profile.code === 400) {
            window.localStorage.removeItem('authData');
        }
    }, [profile]);

    return (
        <div className='profile'>
            {profile.code && profile.code !== 200 && (
                <div className='d-flex justify-content-center'>
                    <p className='alert alert-danger w-fit'>{profile.message}</p>
                </div>
            )}
            <>
                <Spinner isLoading={isLoading} />
                <UserProfile profile={profile} />
                <ContactDetails profile={profile} />
            </>
            )
        </div>
    );
}

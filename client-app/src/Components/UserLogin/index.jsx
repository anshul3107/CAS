import React from 'react';
import LoginForm from './subComponents/LoginForm';

import API from '../../helper/api';

export default function () {
    const onSubmit = (user) => {
        API.post('/auth/token', user);
    };

    return <LoginForm onSubmit={onSubmit} />;
}

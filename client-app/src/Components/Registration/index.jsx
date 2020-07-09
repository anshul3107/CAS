import React from 'react';
import RegistrationForm from './subComponents/RegistrationForm';

import API from '../../helper/api';

export default function () {
    const onSubmit = (user) => {
        API.post('/api/user/registration', user);
    };

    return <RegistrationForm onSubmit={onSubmit} />;
}

import React, {useEffect, useState} from 'react';

import API from '../../helper/api';
import {Spinner} from '../../Elements';

export default function ({email, token}) {
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        API.get(`/api/email/verify-token?token=${token}&email=${email}`).then((res) => {
            setVerificationStatus(res);
            setLoading(false);
        });
    }, [email, token]);

    return (
        <div className='d-flex justify-content-center'>
            <div className='py-4 px-3'>
                <Spinner isLoading={isLoading} />
                {(!verificationStatus || (verificationStatus && !verificationStatus.isVerified)) && (
                    <p className='alert alert-warning'>
                        Please wait, While we are working on updating your Email Verification Status.
                    </p>
                )}
                {verificationStatus && verificationStatus.isVerified && (
                    <p className='alert alert-success'>
                        Your Email {verificationStatus.email} has been verified successfully.
                    </p>
                )}
                {verificationStatus && verificationStatus.code && verificationStatus.code !== 200 && (
                    <p className='alert alert-danger'>{verificationStatus.message}</p>
                )}
            </div>
        </div>
    );
}

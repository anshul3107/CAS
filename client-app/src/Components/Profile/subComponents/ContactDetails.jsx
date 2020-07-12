import React, {useEffect, useState} from 'react';

import API from '../../../helper/api';
import {Label} from '../../../Elements';

export default function ({profile}) {
    const [emailedRes, setEmailedRes] = useState(null);

    const resendVerificationEmail = (email) => {
        if (email) {
            API.get(`/public/api/email/verification/resend?email=${email}`).then((res) => {
                setEmailedRes(res);
            });
        }
    };

    return (
        <div className='accnt-details mx-5'>
            <h2>Account Details</h2>
            <hr />
            <div>
                <Label fieldData='Phone Number' valueData={profile.phoneNumber} />
                <Label
                    fieldData='Email'
                    valueData={
                        <span className='d-flex align-items-center'>
                            {profile.email}
                            {profile.isVerified ? (
                                <span className='material-icons text-green fs-smaller mx-2'>check_circle_outline</span>
                            ) : (
                                <>
                                    <span className='material-icons text-error fs-smaller mx-2'>error_outline</span>
                                    <span
                                        className='border rounded px-2 cursor-pointer fs-smaller'
                                        onClick={() => resendVerificationEmail(profile.email)}>
                                        re-send Verification Email
                                    </span>
                                </>
                            )}
                        </span>
                    }
                />
            </div>
            {emailedRes && emailedRes.email && (
                <div className='d-flex justify-content-center mt-5'>
                    <p className='w-fit alert alert-success py-2'>
                        An Email has been successfully resent to {profile.email}
                    </p>
                </div>
            )}
        </div>
    );
}

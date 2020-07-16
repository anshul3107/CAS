import React, {useState} from 'react';

import {Input, Button, Spinner} from '../../Elements';
import API from '../../helper/api';

export default function ({action, email, token}) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordUpdateResponse, setPasswordUpdateResponse] = useState('');

    const checkValidation = () => {
        let focusField = '';
        if (action === 'change' && !currentPassword) {
            setErrMsg('Mandatory Field. Please Enter your Current Password.');
            focusField = focusField === '' ? 'currentPassword' : focusField;
        }
        if (!newPassword) {
            setErrMsg('Mandatory Field. Please Enter your New Password.');
            focusField = focusField === '' ? 'newPassword' : focusField;
        }
        if (!confirmPassword) {
            setErrMsg('Mandatory Field. Please Enter your New Password again to confirm.');
            focusField = focusField === '' ? 'confirmPassword' : focusField;
        }
        if (newPassword !== confirmPassword) {
            setErrMsg('Values provided for New Password and Confirm Password did not match!');
            setNewPassword('');
            setConfirmPassword('');
            focusField = focusField === '' ? 'newPassword' : focusField;
        }
        if (currentPassword === newPassword) {
            setErrMsg('New password must be different from Current Password!');
            setNewPassword('');
            setConfirmPassword('');
            focusField = focusField === '' ? 'newPassword' : focusField;
        }
        if (focusField && document.getElementById(focusField)) {
            document.getElementById(focusField).focus();
        }
        return focusField === '';
    };

    const updatePassword = () => {
        setIsLoading(true);
        API.post(`/api/user/update-password?action=${action}&email=${email}&token=${token}`, {
            currentPassword,
            newPassword
        }).then((res) => {
            if (res.code === 200) {
                setPasswordUpdateResponse(res.message);
                setErrMsg('');
            }
            if (res.code !== 200) {
                setErrMsg(res.message);
                setPasswordUpdateResponse('');
            }
            setIsLoading(false);
        });
    };

    return (
        <div className='manage-password'>
            <Spinner isLoading={isLoading} />
            <div className='d-flex justify-content-center'>
                <div className='col-12 col-md-6'>
                    <h3 className='mb-3'>
                        {(action === 'change' && 'Change Password') || (action === 'reset' && 'Reset Password')}
                    </h3>
                    <span className='font-italic fs-smaller text-grey'>
                        Please fill in your details. [ * marks mandatory fields]
                    </span>
                    {action === 'change' && (
                        <Input
                            id='currentPassword'
                            valueType='password'
                            labelData='* Current Password'
                            labelClass='text-grey pt-2px'
                            valueData={currentPassword}
                            valueClass='pl-150px'
                            onChange={(event) => {
                                setCurrentPassword(event.target.value);
                                setErrMsg('');
                            }}
                        />
                    )}
                    <Input
                        id='newPassword'
                        valueType='password'
                        labelData='* New Password'
                        labelClass='text-grey pt-2px'
                        valueData={newPassword}
                        valueClass='pl-150px'
                        onChange={(event) => {
                            setNewPassword(event.target.value);
                            setErrMsg('');
                        }}
                    />
                    <Input
                        id='confirmPassword'
                        valueType='password'
                        labelData='* Confirm Password'
                        labelClass='text-grey pt-2px'
                        valueData={confirmPassword}
                        valueClass='pl-150px'
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                            setErrMsg('');
                        }}
                    />
                    <div className='d-flex justify-content-end'>
                        <Button
                            buttonLabel='Submit'
                            buttonClass='col-12 col-md-4 box btn btn-primary'
                            onClick={() => {
                                if (checkValidation()) {
                                    updatePassword();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center mt-4'>
                {passwordUpdateResponse && <p className='alert alert-success w-fit'>{passwordUpdateResponse}</p>}
            </div>
            <div className='d-flex justify-content-center mt-4'>
                {errMsg && <p className='alert alert-danger w-fit'>{errMsg}</p>}
            </div>
        </div>
    );
}

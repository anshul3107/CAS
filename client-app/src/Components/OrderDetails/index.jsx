import React, {useState, useEffect} from 'react';
import moment from 'moment';

import API from '../../helper/api';
import {Spinner, Label} from '../../Elements';

export default function ({orderId}) {
    const [orderDetails, setOrderDetails] = useState({});
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        API.get(`/api/order/details/${orderId}`).then((res) => {
            setOrderDetails(res);
            setLoading(false);
        });
    }, [orderId]);
    return (
        <>
            <Spinner isLoading={isLoading} />
            <div className='accnt-details mx-5'>
                {orderDetails && !orderDetails._id ? (
                    <p className='alert alert-danger'>
                        {' '}
                        Details for the given order are Not Available. Please sign in with the same account from which
                        order was placed.
                    </p>
                ) : (
                    <>
                        <div className='d-flex justify-content-between'>
                            <div className='d-flex align-items-end'>
                                <h2>Order ID:</h2>
                                <h5 className='ml-2'>{orderId}</h5>
                            </div>
                            <span className='text-gray d-flex align-items-end mb-2'>
                                created on
                                <span className='ml-1 text-black'>{`${moment(
                                    orderDetails.createdAt,
                                    'DDMMYYYYHHmmss'
                                ).format('DD-MMM @ HH:mm:ss')}`}</span>
                            </span>
                        </div>
                        <hr className='mt-0' />
                        <div className='border box py-2 px-3'>
                            <h6 className='mb-3'>Receiver's Information</h6>
                            <Label
                                fieldClass='text-black'
                                fieldData='Name'
                                valueClass='text-black'
                                valueData={orderDetails.name}
                            />
                            <Label
                                fieldClass='text-black'
                                fieldData='Address'
                                valueClass='text-black'
                                valueData={orderDetails.addressLine1}
                            />
                            <Label
                                fieldClass='text-black'
                                fieldData='Address (continued)'
                                valueClass='text-black'
                                valueData={orderDetails.addressLine2}
                            />
                            <Label
                                fieldClass='text-black'
                                fieldData='Postal Code'
                                valueClass='text-black'
                                valueData={orderDetails.postalCode}
                            />
                            <Label
                                fieldClass='text-black'
                                fieldData='City'
                                valueClass='text-black'
                                valueData={orderDetails.city}
                            />
                            <Label
                                fieldClass='text-black'
                                fieldData='Country'
                                valueClass='text-black'
                                valueData={orderDetails.country}
                            />
                            <hr />
                            <Label
                                fieldClass='text-black'
                                fieldData='Phone Numner'
                                valueClass='text-black'
                                valueData={orderDetails.phoneNumber}
                            />
                            <Label
                                fieldClass='text-black'
                                fieldData='Email'
                                valueClass='text-black'
                                valueData={orderDetails.email}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

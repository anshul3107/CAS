import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';

import {Spinner} from '../../Elements';
import API from '../../helper/api';

export default function () {
  const [orderList, setOrderList] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get('/api/order/list').then((res) => {
      setOrderList(res);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Spinner isLoading={isLoading} />
      <div className='accnt-details mx-5'>
        <div className='d-flex justify-content-between align-items-end'>
          <h2 className='mb-0'>Order List</h2>
          <span>
            <Link to='/order/new' className='fs-bolder'>
              {'Place a New Order'}
            </Link>
          </span>
        </div>
        <hr />
        {orderList && orderList.length === 0 ? (
          <p className='alert alert-info'>You have not placed any Orders yet!</p>
        ) : (
          <>
            {orderList &&
              orderList.map((order) => {
                return (
                  <div
                    key={order.orderId}
                    className='border box py-2 px-3 mb-3 cursor-pointer'
                    onClick={() => {
                      window.location.pathname = `/order/details/${order.orderId}`;
                    }}>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <span className='text-gray'>Order ID:</span>
                        <span className='ml-2 fs-smaller'>{order.orderId}</span>
                      </div>
                      <Link
                        to={`/order/details/${order.orderId}`}
                        className='cursor-pointer d-flex align-content-center'>
                        <span className='fs-smaller'>View Details</span>
                        <span className='material-icons'>arrow_right</span>
                      </Link>
                    </div>
                    <div className='d-flex justify-content-between fs-smaller'>
                      <span className='text-gray'>
                        Created on
                        <span className='ml-1 text-black'>
                          {moment(order.orderDate, 'DDMMYYYYHHmmss').format('DD-MMM @ HH:mm:ss')}
                        </span>
                      </span>
                      <span className='text-gray'>
                        delivering To
                        <span className='ml-1 text-black'>{order.receiverInfo.name}</span>
                      </span>
                      <span className='text-gray'>
                        at Location
                        <span className='ml-1 text-black'>{`${order.receiverInfo.city}, ${order.receiverInfo.country}`}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </>
  );
}

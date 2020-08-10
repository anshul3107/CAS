import React from 'react';
import {Label} from '../../../Elements';

export default function ({profile}) {
    return (
        <div className='user-profile mx-5 mb-5'>
            <h2>User Profile</h2>
            <hr />
            <div>
                <Label fieldData='Name' valueData={profile.firstName + ' ' + profile.lastName} />
                <Label fieldData='Address' valueData={profile.addressLine1 + ' ' + profile.addressLine2} />
                <Label fieldData='Postal Code' valueData={profile.postalCode} />
                <Label fieldData='City' valueData={profile.city} />
                <Label fieldData='Country' valueData={profile.country} />
            </div>
        </div>
    );
}

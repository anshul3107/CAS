import React from 'react';
import Dropdown from 'react-dropdown';

import 'react-dropdown/style.css';
import './style.scss';

export default function ({
  label = '',
  labelClass = '',
  options = [],
  onSelect,
  defaultOption,
  controlClass = '',
  placeholder = 'Select an option',
  placeholderClass = '',
  menuClass = ''
}) {
  return (
    <div className='dropdown-wrap'>
      <div className={`position-absolute z-100 dropdown-label ${labelClass}`}>{label}</div>
      <Dropdown
        className={`dropdown mb-2`}
        controlClassName={`control ${controlClass}`}
        placeholderClassName={`placeholder ${placeholderClass}`}
        menuClassName={`menu ${menuClass}`}
        options={options}
        onChange={onSelect}
        value={defaultOption || options[0]}
        placeholder={placeholder}
      />
    </div>
  );
}

import React from 'react';

import './style.scss';

export default function ({
  wrapClass = '',
  fieldData = '',
  fieldClass = '',
  valueData = '',
  valueClass = '',
  isStrong = true
}) {
  return (
    <div className={`d-flex ${wrapClass}`}>
      <span className={`${fieldClass} col-3 pr-0`}>{isStrong ? <strong>{fieldData}</strong> : fieldData}</span>
      {valueData && <span className={`${valueClass} col-9 pl-0`}>{valueData}</span>}
    </div>
  );
}

import React from 'react';

export default function Container({ children, className = '', style = {}, as: Tag = 'div' }) {
  return (
    <Tag className={`container ${className}`} style={style}>
      {children}
    </Tag>
  );
}

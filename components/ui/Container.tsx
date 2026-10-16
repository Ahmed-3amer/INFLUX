import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export default function Container({
  children,
  className = '',
  style = {},
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={`container ${className}`} style={style}>
      {children}
    </Tag>
  );
}

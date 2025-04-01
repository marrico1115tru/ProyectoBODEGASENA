import React from 'react';

export const Card = ({ className, children, ...props }) => {
    return (
      <div className={`bg-white shadow-lg rounded-lg p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  };
  
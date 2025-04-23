import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`bg-white shadow-xl rounded-2xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

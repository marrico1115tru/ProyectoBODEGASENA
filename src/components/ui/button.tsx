import React from "react";

export const Button = ({ variant = "default", className, children, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-md transition-all duration-300 focus:outline-none";
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      ghost: "bg-transparent text-gray-200 hover:bg-gray-800",
    };
    return (
      <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  };
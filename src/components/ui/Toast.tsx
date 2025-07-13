import React from "react";

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => (
  <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow z-50 animate-fade-in">
    {message}
  </div>
);

export default Toast;

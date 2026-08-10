import React from 'react';

export const CloverLogo = ({ className = "w-8 h-8" }) => {
  return (
    <img
      src="/logo.png"
      alt="두람 로고"
      className={`object-cover ${className}`}
    />
  );
};
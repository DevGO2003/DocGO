'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileTextOutlined } from '@ant-design/icons';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
  className = ''
}) => {
  const router = useRouter();

  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div 
      className={`flex items-center space-x-2 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className={`${sizeClasses[size]} flex items-center justify-center bg-blue-600 rounded-lg`}>
        <FileTextOutlined className="text-white text-lg" />
      </div>
      
      {showText && (
        <span className={`font-bold text-blue-600 ${textSizeClasses[size]}`}>
          DocGO
        </span>
      )}
    </div>
  );
};

export default Logo;

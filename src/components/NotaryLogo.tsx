import React from 'react';
import logoImg from '../assets/images/notary_662_logo_1785364787756.jpg';

interface NotaryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const NotaryLogo: React.FC<NotaryLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href="https://www.notary662th.ir/"
        target="_blank"
        rel="noopener noreferrer"
        className={`relative shrink-0 rounded-full overflow-hidden border-2 border-[#D3B574] shadow-md bg-white p-0.5 flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer ${sizeClasses[size]}`}
        title="دفتر اسناد رسمی ۶۶۲ تهران - notary662th.ir"
      >
        <img
          src={logoImg}
          alt="لوگوی رسمی دفتر اسناد رسمی ۶۶۲ تهران - خانم لیلا فرج زاده"
          className="w-full h-full object-contain rounded-full bg-white"
          referrerPolicy="no-referrer"
        />
      </a>
      {showText && (
        <div className="flex flex-col">
          <a
            href="https://www.notary662th.ir/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-[#002279] text-base leading-tight tracking-tight hover:text-[#D3B574] transition-colors"
          >
            دفتر اسناد رسمی ۶۶۲ تهران
          </a>
          <span className="text-[11px] font-bold text-[#D3B574] flex items-center gap-1 mt-0.5">
            <span>سردفتر: خانم لیلا فرج زاده</span>
          </span>
        </div>
      )}
    </div>
  );
};

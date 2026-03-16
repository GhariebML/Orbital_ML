import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideCloseButton = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div
        role="dialog"
        className={clsx(
          'relative w-full max-w-lg rounded-[16px] border border-[#1f2937] bg-[#0b1020] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.65)]',
          'animate-in zoom-in-95 fade-in duration-200',
          className
        )}
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-[#9CA3AF] transition-colors hover:bg-[#1f2937] hover:text-[#F9FAFB]"
          >
            <X size={20} />
          </button>
        )}
        
        {title && (
          <h2 className="mb-4 text-xl font-semibold text-[#F9FAFB] pr-8">
            {title}
          </h2>
        )}
        
        <div className="mt-2 text-[#F9FAFB]">
          {children}
        </div>
      </div>
    </div>
  );
};

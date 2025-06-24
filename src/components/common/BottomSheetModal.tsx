import React, { useEffect } from 'react';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * 바텀시트 모달 컴포넌트
 * 하단에서 올라오는 모달 형태로 표시됩니다.
 */
export default function BottomSheetModal({
  isOpen,
  onClose,
  children,
  className = '',
}: BottomSheetModalProps) {
  // 배경 클릭시 닫기

  // ESC 키 눌렀을 때 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-30 ${
        isOpen ? '' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
          position: 'absolute',
          width: 390,
          height: 240,
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 0,
          background: '#FFFFFF',
          boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px 8px 0px 0px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

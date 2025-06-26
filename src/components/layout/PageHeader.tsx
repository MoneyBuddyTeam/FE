import { ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Text from '../common/Text';
import Button from '../common/Button';

type PageHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  isLoginPage?: boolean;
  rightButtonLabel?: string;
  onRightLabelClick?: () => void;
};

export default function PageHeader({
  title,
  showBackButton = true,
  onBackClick,
  isLoginPage = false,
  rightButtonLabel,
  onRightLabelClick,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  if (isLoginPage) {
    return null;
  }

  const isExpertTitle = title === '머니버디 엑스퍼트';

  return (
    <div className="flex items-center justify-center relative px-4 py-4">
      {showBackButton && (
        <button
          onClick={handleBack}
          className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={24} strokeWidth={2} className="text-[#111111]" />
        </button>
      )}
      <Text type="H1" className="mx-auto">
        {title}
      </Text>
      {isExpertTitle && (
        <button
          onClick={() => navigate('/search')}
          className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
          aria-label="검색"
        >
          <Search size={22} strokeWidth={2} className="text-[#111111]" />
        </button>
      )}
      {!isExpertTitle && rightButtonLabel && (
        <Button
          variant="text"
          onClick={onRightLabelClick}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          {rightButtonLabel}
        </Button>
      )}
    </div>
  );
}

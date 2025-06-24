import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useReservationStore } from '../../../../stores/useReservationStore';
import { useToggleBookmark } from '../../../../hooks/useBookmarks';
import type { Expert } from '../../../../types';

interface FixedBottomProps {
  localBookmarkState: boolean;
  handleLikeClick: (e: React.MouseEvent) => void;
  expert: Expert;
}

export default function FixedBottom({
  localBookmarkState,
  handleLikeClick,
  expert,
}: FixedBottomProps) {
  const navigate = useNavigate();
  const { setExpert } = useReservationStore();
  const toggleBookmarkMutation = useToggleBookmark();

  const handleConsultClick = () => {
    setExpert(expert);
    navigate('/reservation/step1');
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log('API 호출: 북마크 토글 - 전문가 ID:', expert.id);
    console.log('🔖 북마크 핸들러 호출됨:', {
      advisorId: expert.id.toString(),
    });

    try {
      await toggleBookmarkMutation.mutateAsync(expert.id);
      handleLikeClick(e);
      console.log('✅ 북마크 토글 성공:', expert.nickname);
    } catch (error) {
      console.error('❌ 북마크 토글 실패:', error);
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 py-4 px-5 flex items-center justify-between">
      <button
        onClick={handleBookmarkToggle}
        className="flex flex-col items-center justify-center"
        disabled={toggleBookmarkMutation?.isPending}
        type="button"
      >
        <Heart
          size={24}
          className={
            localBookmarkState ? 'fill-red-500 text-red-500' : 'text-gray-500'
          }
        />
      </button>
      <button
        onClick={handleConsultClick}
        className="flex-1 ml-4 bg-primary text-white py-3 rounded font-medium"
      >
        지금 상담하기
      </button>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToggleBookmark } from '../../../hooks/useBookmarks';
import { useExpert } from '../../../hooks/useExpert';
import FixedBottom from './components/FixedBottom';

export default function ExpertDetailPage() {
  const { expertId } = useParams<{ expertId: string }>();
  const [localBookmarkState, setLocalBookmarkState] = useState(false);
  const toggleBookmarkMutation = useToggleBookmark();

  // 전문가 상세 정보 가져오기
  const {
    data: expert,
    isLoading,
    error,
  } = useExpert(expertId ? parseInt(expertId) : undefined);

  // 북마크 상태 초기화
  useEffect(() => {
    if (expert?.isBookmarked !== undefined) {
      setLocalBookmarkState(expert.isBookmarked);
    }
  }, [expert]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!expert) return;

    try {
      setLocalBookmarkState(!localBookmarkState);
      await toggleBookmarkMutation.mutateAsync(expert.id);
    } catch (error) {
      setLocalBookmarkState(localBookmarkState);
      console.error('북마크 토글 실패:', error);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error || !expert) return <div>전문가 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      {/* ...existing code... */}

      <FixedBottom
        localBookmarkState={localBookmarkState}
        handleLikeClick={handleLikeClick}
        expert={expert}
      />
    </div>
  );
}

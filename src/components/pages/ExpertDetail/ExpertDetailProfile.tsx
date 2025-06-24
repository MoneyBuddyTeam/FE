// C:\project\FE\src\components\pages\ExpertDetail\ExpertDetailProfile.tsx

import { useState, useEffect } from 'react';
import type { Expert } from '../../../types/expert';
import { useToggleBookmark } from '../../../hooks/useBookmarks';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import ExpertInfo from './components/ExpertInfo';
import ExpertIntroduction from './components/ExpertIntroduction';
import ExpertSkills from './components/ExpertSkills';
import ExpertCareer from './components/ExpertCareer';
import LectureTab from './components/tabs/LectureTab';
import MagazineTab from './components/tabs/MagazineTab';
import ReviewTab from './components/tabs/ReviewTab';
import FixedBottom from './components/FixedBottom';

interface ExpertDetailProfileProps {
  expert: Expert & {
    skills?: string[];
    education?: string[];
    career?: string[];
    contact_hours?: string;
    response_time?: string;
    consultation_formats?: string[];
  };
  isBookmarked?: boolean;
}

export default function ExpertDetailProfile({
  expert,
  isBookmarked = false,
}: ExpertDetailProfileProps) {
  const [activeTab, setActiveTab] = useState('전문가');
  const [localBookmarkState, setLocalBookmarkState] = useState(isBookmarked);
  const toggleBookmarkMutation = useToggleBookmark();

  // expert 데이터가 변경될 때 북마크 상태 업데이트
  useEffect(() => {
    if (expert?.isBookmarked !== undefined) {
      setLocalBookmarkState(expert.isBookmarked);
    }
  }, [expert]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log('API 호출: 북마크 토글 - 전문가 ID:', expert.id);
    console.log('🔖 북마크 핸들러 호출됨:', {
      advisorId: expert.id.toString(),
    });

    try {
      setLocalBookmarkState(!localBookmarkState);

      // API 호출
      await toggleBookmarkMutation.mutateAsync(expert.id);
      console.log('✅ 북마크 토글 성공:', expert.nickname);
    } catch (error) {
      // 실패 시 원래 상태로 복원
      setLocalBookmarkState(localBookmarkState);
      console.error('❌ 북마크 토글 실패:', error);
    }
  };

  return (
    <div className="relative w-full pb-20">
      <ProfileHeader expert={expert} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === '전문가' && (
        <div className="p-6">
          <ExpertInfo expert={expert} />
          <ExpertIntroduction expert={expert} />
          <ExpertSkills expert={expert} />
          <ExpertCareer expert={expert} />
        </div>
      )}

      {activeTab === '강의' && <LectureTab />}
      {activeTab === '매거진' && <MagazineTab />}
      {activeTab === '후기' && <ReviewTab />}

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] z-10">
        <FixedBottom
          localBookmarkState={localBookmarkState}
          handleLikeClick={handleLikeClick}
          expert={expert}
        />
      </div>
    </div>
  );
}

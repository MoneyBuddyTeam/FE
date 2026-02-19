import { useState, useMemo, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import Text from '../../components/common/Text';
import { useBookmarksQuery } from '../../hooks/useBookmarks';
import { expertData } from '../../data/expertData';
import type { Expert } from '../../types/expert';
import ExpertCard from '../../components/pages/ExpertList/ExpertCard';

// 북마크된 전문가 탭 컴포넌트 - experts-list와 동일한 스타일
const BookmarkedExpertsTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = ['소비', '저축', '투자', '부채', '기타'];

  return (
    <div className="flex mb-6 border-b">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            flex-1 py-3 text-center
            ${activeTab === tab ? 'border-b-2 border-primary text-primary font-medium' : 'text-font2'}
          `}
        >
          <Text type="B2">{tab}</Text>
        </button>
      ))}
    </div>
  );
};

// 엑스퍼트 목록 컴포넌트
const BookmarkedExpertsList = ({ experts }: { experts: Expert[] }) => {
  const navigate = useNavigate();

  if (experts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-5 w-[390px] h-[421px] rounded-lg">
        {/* 이미지와 텍스트 프레임 */}{' '}
        <div className="flex flex-col items-center gap-3 w-[310px] h-[175px]">
          {/* 동전 이미지 */}
          <div className="w-[119px] h-[123px] mb-3">
            <img
              src="/jpg/icon/none.png"
              alt="좋아요한 엑스퍼트 없음"
              className="w-full h-full object-contain"
              onError={e => {
                // 이미지가 없을 경우 대체 요소로 변경
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-[119px] h-[123px] flex items-center justify-center">
                      <div class="relative">
                        <!-- 뒤쪽 동전 -->
                        <div class="absolute right-0 w-[60px] h-[60px] bg-gray-200 rounded-full border-4 border-gray-400 flex items-center justify-center">
                          <div class="w-[24px] h-[24px] bg-gray-400 rounded-full flex items-center justify-center text-gray-600 text-xs">�</div>
                        </div>
                        <!-- 앞쪽 동전 (웃는 얼굴) -->
                        <div class="absolute left-0 w-[60px] h-[60px] bg-yellow-400 rounded-full border-4 border-gray-600 flex items-center justify-center z-10 text-gray-600 text-lg">😊</div>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>

          {/* 텍스트 */}
          <div className="w-[310px] h-10 font-pretendard font-semibold text-sm leading-[140%] text-center tracking-[-0.025em] text-[#777777]">
            좋아요한 엑스퍼트가 없어요,
            <br />
            지금 엑스퍼트를 둘러보아요
          </div>
        </div>
        {/* 버튼 */}
        <button
          onClick={() => navigate('/experts-list')}
          className="box-border flex flex-row justify-center items-center py-[14px] px-[22px] gap-[10px] w-[310px] h-[46px] bg-white border border-[#6790FF] backdrop-blur-[8px] rounded-[4px] transition-colors hover:bg-gray-50"
        >
          <span className="w-[112px] h-4 font-pretendard font-semibold text-base leading-4 text-center tracking-[-0.025em] text-[#6488FF]">
            엑스퍼트 보러가기
          </span>
        </button>
      </div>
    );
  }
  return (
    <div className="divide-y divide-stroke">
      {experts.map(expert => (
        <ExpertCard key={expert.id} expert={expert} isBookmarked={true} />
      ))}
    </div>
  );
};

// 스크롤 컨테이너 컴포넌트
const ScrollContainer = ({
  children,
  title = '좋아요한 엑스퍼트',
}: {
  children: ReactNode;
  title?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-[844px] overflow-y-scroll select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        scrollbarColor: 'transparent transparent',
      }}
    >
      <div className="sticky top-0 bg-white z-20">
        <PageHeader title={title} showBackButton />
      </div>
      {children}
    </div>
  );
};

export default function BookmarkedExpertsPage() {
  const [activeTab, setActiveTab] = useState('소비');
  const { data: bookmarkedExperts, isLoading, error } = useBookmarksQuery();

  // 실제 API 데이터가 없을 때만 mockData 사용
  const mockBookmarkedExperts = useMemo(() => {
    return expertData
      .slice(0, 5)
      .map(expert => ({ ...expert, isBookmarked: true }));
  }, []);

  const allBookmarkedExperts = bookmarkedExperts?.length
    ? bookmarkedExperts
    : mockBookmarkedExperts;

  // 탭별 필터링
  const filteredExperts = useMemo(() => {
    if (activeTab === '소비') return allBookmarkedExperts;
    return allBookmarkedExperts.filter(expert => expert.field === activeTab);
  }, [allBookmarkedExperts, activeTab]);

  if (isLoading) {
    return (
      <PageWrapper>
        <ScrollContainer>
          <div className="flex justify-center items-center h-[600px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </ScrollContainer>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <ScrollContainer>
          <div className="p-5 text-center">
            <Text type="B1" className="text-gray-500">
              좋아요한 엑스퍼트를 불러오는데 실패했습니다.
            </Text>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              다시 시도
            </button>
          </div>
        </ScrollContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ScrollContainer title="좋아요한 엑스퍼트">
        {' '}
        <div className="py-4">
          {' '}
          {/* 탭 섹션 */}
          <div className="px-5">
            <BookmarkedExpertsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          {/* 엑스퍼트 목록 - 왼쪽 여백 제거 */}
          <BookmarkedExpertsList experts={filteredExperts} />
        </div>
      </ScrollContainer>
    </PageWrapper>
  );
}

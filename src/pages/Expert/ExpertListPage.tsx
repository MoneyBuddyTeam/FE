import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import ExpertCard from '../../components/pages/ExpertList/ExpertCard';
import Text from '../../components/common/Text';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useInfiniteExpertList } from '../../hooks/useExpertList';
import type { SortType } from '../../types/expert';

const EXPERT_FIELDS_WITH_ALL = [
  '전체',
  '소비',
  '저축',
  '투자',
  '부채',
  '기타',
] as const;

const SORT_OPTIONS: SortType[] = [
  '최신순',
  '북마크순',
  '평점순',
  '상담건순',
  '낮은가격순',
  '높은가격순',
  '이름순',
  '리뷰많은순',
];

export default function ExpertListPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>('전체');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortType>('최신순');
  const containerRef = useRef<HTMLDivElement>(null);

  // URL 파라미터에서 tab 읽어서 초기 탭 설정
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl && EXPERT_FIELDS_WITH_ALL.includes(tabFromUrl as any)) {
      setSelectedTab(tabFromUrl);
    }
  }, []);
  // 실제 API 호출
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteExpertList({
    category_id:
      selectedTab === '전체' ? undefined : getCategoryId(selectedTab),
    sort: getSortParam(selectedSort),
    limit: 10,
  });

  console.log('🎯 ExpertListPage 상태:', {
    isLoading,
    error,
    dataPages: data?.pages?.length,
    firstPageExperts: data?.pages[0]?.experts?.length,
    hasNextPage,
    isFetchingNextPage,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 카테고리 ID 매핑
  function getCategoryId(category: string): string {
    const categoryMap: Record<string, string> = {
      소비: '1',
      저축: '2',
      투자: '3',
      부채: '4',
      기타: '5',
    };
    return categoryMap[category] || '1';
  }

  // 정렬 파라미터 매핑
  function getSortParam(sort: SortType): string {
    const sortMap: Record<SortType, string> = {
      최신순: 'created_at,desc',
      북마크순: 'bookmarks,desc',
      평점순: 'rating,desc',
      상담건순: 'consultation_count,desc',
      낮은가격순: 'price,asc',
      높은가격순: 'price,desc',
      이름순: 'nickname,asc',
      리뷰많은순: 'review_count,desc',
    };
    return sortMap[sort] || 'created_at,desc';
  }

  // 전체 전문가 목록에서 월간 전문가 추출 (첫 페이지 데이터에서)
  const monthlyExperts = data?.pages[0]?.experts?.slice(0, 5) || [];
  const totalExperts = data?.pages[0]?.total || 0;

  return (
    <PageWrapper>
      <div
        ref={containerRef}
        className="h-[844px] overflow-y-scroll select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="sticky top-0 bg-white z-20">
          <PageHeader
            title="머니버디 엑스퍼트"
            showBackButton={true}
            onBackClick={() => navigate('/search')}
          />
          <div className="flex border-b">
            {EXPERT_FIELDS_WITH_ALL.map(field => (
              <button
                key={field}
                onClick={() => {
                  setSelectedTab(field);
                  // URL 업데이트
                  const url = new URL(window.location.href);
                  url.searchParams.set('tab', field);
                  window.history.replaceState({}, '', url.toString());
                }}
                className={`
                  flex-1 py-3 text-center transition-colors
                  ${
                    selectedTab === field
                      ? 'border-b-2 border-primary text-primary font-medium'
                      : 'text-font2 hover:text-font1'
                  }
                `}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        <div>
          <section className="w-[390px] h-[361px] px-5 pt-6 pb-[30px] mb-0">
            <Text type="H2" className="mb-[20px]">
              이달의 엑스퍼트
            </Text>
            <ScrollContainer
              className="scroll-container hide-scrollbar"
              vertical={false}
              horizontal={true}
              hideScrollbars={true}
            >
              <div className="flex gap-[10px] min-w-max">
                {monthlyExperts.map(expert => (
                  <div key={expert.id} className="w-[148px]">
                    <ExpertCard expert={expert} isMonthly />
                  </div>
                ))}
              </div>
            </ScrollContainer>
          </section>

          <div className="flex justify-between items-center px-5 mb-4 sticky top-[50px] bg-white z-10">
            <Text type="B2" className="text-font2">
              총 {totalExperts}명의 전문가가 있어요
            </Text>

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center justify-between text-xs text-primary border border-primary rounded-lg w-[95px] h-[32px] px-3"
              >
                <span>{selectedSort}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 bg-white border rounded-lg shadow-lg z-10 w-[95px] p-2 top-[36px]">
                  {SORT_OPTIONS.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left text-xs leading-none hover:text-primary transition-colors ${
                        index !== SORT_OPTIONS.length - 1 ? 'mb-2' : ''
                      }`}
                      style={{
                        color: selectedSort === option ? '#6488FF' : '#777777',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-5 pb-[10px]">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {data?.pages.map((page, i) => (
                  <div key={i}>
                    {page.experts?.map(expert => (
                      <ExpertCard key={expert.id} expert={expert} />
                    ))}
                  </div>
                ))}

                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )}

                <div ref={observerTarget} className="h-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

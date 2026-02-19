import { useState, useMemo, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import WarningSection from '../../components/pages/ConsultationHistory/WarningSection';
import TabSection from '../../components/pages/ConsultationHistory/TabSection';
import ConsultationCard from '../../components/pages/ConsultationHistory/ConsultationCard';
import FilterDropdown from '../../components/pages/ConsultationHistory/FilterDropdown';
import type { ConsultationHistory } from '../../types/consultation';
import { generateConsultationData } from '../../data/consultationData';

// 스크롤 컨테이너 컴포넌트
const ScrollContainer = ({
  children,
  title = '상담 예약 내역',
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
        <WarningSection />
      </div>
      {children}
    </div>
  );
};

// 필터 옵션 정의
const FILTER_OPTIONS = ['최신순', '오래된순'] as const;

export default function ConsultationHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('최신순');

  // 공통 데이터 함수 사용
  const consultations = useMemo<ConsultationHistory[]>(() => {
    return generateConsultationData();
  }, []);

  // 탭에 따른 필터링 및 정렬
  const filteredConsultations = useMemo(() => {
    let filtered = [...consultations];

    // 탭 필터링
    switch (activeTab) {
      case 'scheduled':
        filtered = filtered.filter(c => c.status === '예약완료');
        break;
      case 'ongoing':
        filtered = filtered.filter(
          c => c.status === '상담중' || c.status === '상담완료',
        );
        break;
      case 'cancelled':
        filtered = filtered.filter(
          c => c.status === '취소중' || c.status === '취소완료',
        );
        break;
      default:
        // 전체 탭은 모든 데이터 포함
        break;
    }

    // 정렬 필터링 - 로직 수정
    if (selectedFilter === '오래된순') {
      filtered.sort((a, b) => b.id - a.id); // 오래된 순 (ID 내림차순)
    } else {
      filtered.sort((a, b) => a.id - b.id); // 최신순 (ID 오름차순)
    }

    return filtered;
  }, [consultations, activeTab, selectedFilter]);

  const handleConsultationDetail = (consultation: ConsultationHistory) => {
    navigate(`/consultation/detail/${consultation.id}`);
  };
  const handleChatClick = (consultation: ConsultationHistory) => {
    navigate(`/consultation/rooms/${consultation.id}`);
  };

  const handleCancelClick = (consultation: ConsultationHistory) => {
    console.log('상담 취소:', consultation.id);
  };

  const handleReviewClick = (consultation: ConsultationHistory) => {
    console.log('리뷰 작성:', consultation.id);
  };

  return (
    <PageWrapper>
      <ScrollContainer title="상담 예약 내역">
        <div className="w-[390px] mx-auto bg-white">
          <TabSection activeTab={activeTab} onTabChange={setActiveTab} />

          {/* 결과 섹션에 필터 드롭다운 추가 */}
          <div className="flex justify-between items-center px-5 py-5">
            <span className="text-sm font-medium text-gray-700">
              총 {filteredConsultations.length}건
            </span>
            <FilterDropdown
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              options={FILTER_OPTIONS}
            />
          </div>

          <div className="px-5 pb-6">
            {filteredConsultations.length > 0 ? (
              <div className="space-y-3">
                {filteredConsultations.map(consultation => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    onDetailClick={() => handleConsultationDetail(consultation)}
                    onChatClick={() => handleChatClick(consultation)}
                    onCancelClick={() => handleCancelClick(consultation)}
                    onReviewClick={() => handleReviewClick(consultation)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">
                  해당 조건의 상담 내역이 없습니다.
                </p>
                <button
                  onClick={() => navigate('/expert')}
                  className="px-6 py-3 bg-primary text-white rounded-lg"
                >
                  전문가 찾아보기
                </button>
              </div>
            )}
          </div>
        </div>
      </ScrollContainer>
    </PageWrapper>
  );
}

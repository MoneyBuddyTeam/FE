import { useState, useMemo, useRef, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PageWrapper from '../../components/layout/PageWrapper';
import PageHeader from '../../components/layout/PageHeader';
import { cancelConsultationApi } from '../../services/consultation/consultationApi';
import type { ConsultationHistory } from '../../types/consultation';
import { expertData } from '../../data/expertData';
import { paymentDetailStyles } from '../../styles/paymentdetail.styles';
import { useReservationStore } from '../../stores/useReservationStore';
import dayjs from 'dayjs';
import { formatConsultationRange } from '../../utils';
// import { formatDate } from '../../utils';

// 스크롤 컨테이너 컴포넌트 추출
const ScrollContainer = ({
  children,
  title = '상세내역',
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

export default function ConsultationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const consultationId = id ? parseInt(id) : 0;
  const {
    selectedDate,
    consultMethod,
    selectedTime,
    content,
    needExtend,
    extendMinutes,
  } = useReservationStore();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  // 상담 목록 데이터와 동일한 로직 사용하여 상태 동기화

  const consultation = useMemo<ConsultationHistory | null>(() => {
    if (consultationId <= 0 || consultationId > expertData.length) return null;

    const expert = expertData[consultationId - 1];
    const consultationIndex = consultationId - 1;

    const typeOptions = [
      '전화상담',
      '화상상담',
      '채팅상담',
      '이메일상담',
    ] as const;
    const paymentOptions = [
      '네이버페이먼츠',
      '카카오페이',
      '토스페이',
      '신용카드',
    ];

    // 날짜를 다양하게 생성 (최근 2주간)
    const baseDate = new Date('2025-01-25');
    const dayOffset = Math.floor(consultationIndex / 2);
    const consultationDate = new Date(baseDate);
    consultationDate.setDate(baseDate.getDate() - dayOffset);

    const formatDate = (date: Date) => {
      const weekdays = [
        '일요일',
        '월요일',
        '화요일',
        '수요일',
        '목요일',
        '금요일',
        '토요일',
      ];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = weekdays[date.getDay()];
      return `2025년 ${month}월 ${day}일 ${weekday}`;
    };

    return {
      id: consultationId,
      expertId: expert.id,
      expertName: expert.nickname,
      field: expert.field,
      date: formatDate(consultationDate),
      time:
        consultationIndex % 3 === 0
          ? '오전 10:00~오전 10:30'
          : consultationIndex % 3 === 1
            ? '오후 2:00~오후 2:30'
            : '오후 4:00~오후 4:30',
      type: typeOptions[consultationIndex % typeOptions.length],
      // 상담 목록과 동일한 상태 로직 적용
      status:
        consultationIndex === 4
          ? '취소완료'
          : consultationIndex === 6
            ? '상담완료'
            : '예약완료',
      amount: expert.price,
      paymentMethod: paymentOptions[consultationIndex % paymentOptions.length],
      paymentDate: `2025.01.${20 - dayOffset}`,
      consultationArea: `${expert.field} 관련 상담`,
      consultationNotes: `더미 텍스트 최근 경제 상황의 불확실성이 커지면서 자산 포트폴리오 재조정에 대한 고민이 많습니다. 현재 주식, 예금, 펀드 등으로 나뉘어 있는데, 인플레이션과 금리 변동에 대비하여 안정적인 수익을 창출할 수 있는 방법이 궁금합니다. 특히 은퇴 후를 위한 노후 자금 마련과 연금 설계는 어떻게 해야 할지 막막합니다. 또한, 예상치 못한 상황에 대비한 비상 자금 확보와 보험의 필요성에 대해서도 상담받고 싶습니다. 전체적인 재무 목표를 설정하고 효율적인 자산 관리 전략을 세우는 데 전문가의 도움이 절실합니다.`,
      reviewStatus:
        consultationIndex === 2 || consultationIndex === 5
          ? 'available'
          : consultationIndex === 7
            ? 'completed'
            : undefined,
      // 정렬을 위한 날짜 객체 추가
      dateObject: consultationDate,
    };
  }, [consultationId]);
  const cancelConsultationMutation = useMutation({
    mutationFn: (id: number) => cancelConsultationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['consultation', consultationId],
      });
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      setShowCancelConfirm(false);
      alert('상담이 취소되었습니다.');
      navigate('/experts-list'); // experts-list 페이지로 이동
    },
    onError: error => {
      console.error('상담 취소 실패:', error);
      alert('상담 취소에 실패했습니다.');
    },
  });
  // 취소 상태인지 확인하는 함수 추가
  const isCancelledStatus = (status: string) => {
    return status === '취소중' || status === '취소완료';
  };

  // 상담완료 상태인지 확인하는 함수 추가
  const isCompletedStatus = (status: string) => {
    return status === '상담완료';
  };

  function handleCancelConsultation() {
    if (consultation) {
      cancelConsultationMutation.mutate(consultation.id);
    }
  }

  const formatDates = (date: string) => {
    return dayjs(date).format('YYYY년 M월 D일 dddd');
  };
  const METHOD_LABEL: Record<string, string> = {
    call: '전화상담',
    chat: '채팅상담',
  };

  // 하단에 고정될 버튼 컴포넌트 - 취소 상태나 상담완료 상태일 때는 버튼 숨김
  const BottomButtons =
    !isCancelledStatus(consultation?.status || '') &&
    !isCompletedStatus(consultation?.status || '') ? (
      <div className="bg-white border-t border-gray-200 p-4 w-full">
        <div className={paymentDetailStyles.buttonSection.buttonGroup}>
          <button
            onClick={() => navigate(`/experts/${consultation?.expertId || 1}`)}
            className={paymentDetailStyles.buttonSection.profileButton}
          >
            전문가 상세보기
          </button>
          <button
            onClick={() => setShowCancelConfirm(true)}
            className={paymentDetailStyles.buttonSection.cancelButton}
          >
            취소하기
          </button>
        </div>
      </div>
    ) : null;

  return (
    <PageWrapper bottomElement={BottomButtons}>
      <ScrollContainer title="상담 예약 상세">
        <div className="w-[390px] mx-auto bg-white pb-24">
          <div className="p-5">
            {/* 상담 내역 카드 */}
            <div className={paymentDetailStyles.consultationSection.container}>
              <div className={paymentDetailStyles.consultationSection.content}>
                {/* 헤더 */}
                <div className={paymentDetailStyles.consultationSection.header}>
                  <span
                    className={
                      paymentDetailStyles.consultationSection.expertName
                    }
                  >
                    {consultation?.expertName || '박재현'}
                  </span>
                  <div
                    className={
                      paymentDetailStyles.consultationSection.statusBadge
                    }
                    style={{
                      backgroundColor: isCancelledStatus(
                        consultation?.status || '',
                      )
                        ? '#E9E9E9'
                        : 'rgba(100,136,255,0.1)',
                    }}
                  >
                    <span
                      className={
                        paymentDetailStyles.consultationSection.statusText
                      }
                      style={{
                        color: isCancelledStatus(consultation?.status || '')
                          ? '#777777'
                          : '#6488FF',
                      }}
                    >
                      {consultation?.status || '예약완료'}
                    </span>
                  </div>
                </div>

                <div
                  className={paymentDetailStyles.consultationSection.divider}
                ></div>
                {/* 상담 정보 */}
                <div
                  className={paymentDetailStyles.consultationSection.infoRow}
                >
                  <span
                    className={paymentDetailStyles.consultationSection.label}
                  >
                    상담 일자
                  </span>
                  <span
                    className={paymentDetailStyles.consultationSection.value}
                  >
                    {selectedDate ? formatDates(selectedDate) : '날짜 미정'}
                  </span>
                </div>

                <div
                  className={paymentDetailStyles.consultationSection.infoRow}
                >
                  <span
                    className={paymentDetailStyles.consultationSection.label}
                  >
                    상담 시간
                  </span>
                  <span
                    className={paymentDetailStyles.consultationSection.value}
                  >
                    {formatConsultationRange(
                      selectedDate,
                      selectedTime,
                      needExtend ? extendMinutes : 15,
                    ) ||
                      consultation?.time ||
                      '오전 10 : 00 ~ 오전 10 : 30'}
                  </span>
                </div>

                <div
                  className={paymentDetailStyles.consultationSection.infoRow}
                >
                  <span
                    className={paymentDetailStyles.consultationSection.label}
                  >
                    상담 방법
                  </span>
                  <span
                    className={paymentDetailStyles.consultationSection.value}
                  >
                    {consultMethod ? METHOD_LABEL[consultMethod] : '전화상담'}
                  </span>
                </div>

                <div
                  className={paymentDetailStyles.consultationSection.infoRow}
                >
                  <span
                    className={paymentDetailStyles.consultationSection.label}
                  >
                    결제 방식
                  </span>
                  <span
                    className={paymentDetailStyles.consultationSection.value}
                  >
                    {consultation?.paymentMethod || '네이버페이먼츠'}
                  </span>
                </div>

                {/* 구분선 */}
                <div
                  className={paymentDetailStyles.consultationSection.divider}
                ></div>

                {/* 결제 금액 - 취소 상태일 때 색상 변경 */}
                <div
                  className={paymentDetailStyles.consultationSection.amountRow}
                >
                  <span
                    className={
                      paymentDetailStyles.consultationSection.amountLabel
                    }
                  >
                    결제 금액
                  </span>
                  <span
                    className={
                      paymentDetailStyles.consultationSection.amountValue
                    }
                    style={{
                      color: isCancelledStatus(consultation?.status || '')
                        ? '#9C9C9C'
                        : '#191919',
                    }}
                  >
                    30,000원
                  </span>
                </div>
              </div>
            </div>
            {/* 상담 고민 등록 - 취소 상태일 때 스타일 변경 */}
            <div
              className={`${
                paymentDetailStyles.consultationConcernSection.container
              } mt-8`}
            >
              <span
                className={paymentDetailStyles.consultationConcernSection.title}
              >
                상담 고민 등록
              </span>

              <div
                className={
                  paymentDetailStyles.consultationConcernSection.contentBox
                }
                style={{
                  backgroundColor: isCancelledStatus(consultation?.status || '')
                    ? '#F1F1F1'
                    : '#FFFFFF',
                }}
              >
                <p
                  className={
                    paymentDetailStyles.consultationConcernSection.contentText
                  }
                  style={{
                    color: isCancelledStatus(consultation?.status || '')
                      ? '#888888'
                      : '#000000',
                  }}
                >
                  {content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollContainer>

      {/* 취소 확인 모달 - 취소 상태일 때는 표시하지 않음 */}
      {showCancelConfirm && !isCancelledStatus(consultation?.status || '') && (
        <div className={paymentDetailStyles.modal.backdrop}>
          <div className={paymentDetailStyles.modal.container}>
            <h4 className={paymentDetailStyles.modal.title}>상담 취소</h4>
            <p className={paymentDetailStyles.modal.content}>
              정말로 상담을 취소하시겠습니까?
            </p>
            <div className={paymentDetailStyles.modal.buttonGroup}>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className={paymentDetailStyles.modal.cancelModalButton}
              >
                아니오
              </button>
              <button
                onClick={handleCancelConsultation}
                disabled={cancelConsultationMutation.isPending}
                className={paymentDetailStyles.modal.confirmButton}
              >
                {cancelConsultationMutation.isPending ? '취소 중...' : '예'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

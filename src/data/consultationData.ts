import type { ConsultationHistory } from '../types/consultation';
import { expertData } from './expertData';

// 상담 내역 데이터 생성 함수
export const generateConsultationData = (): ConsultationHistory[] => {
  return expertData.slice(0, 8).map((expert, index) => {
    const typeOptions = ['전화상담', '채팅상담'] as const;
    const paymentOptions = [
      '네이버페이먼츠',
      '카카오페이',
      '토스페이',
      '신용카드',
    ];

    // 날짜를 다양하게 생성 (최근 2주간)
    const baseDate = new Date('2025-01-25');
    const dayOffset = Math.floor(index / 2);
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
      id: index + 1,
      expertId: expert.id,
      expertName: expert.nickname,
      field: expert.field,
      date: formatDate(consultationDate),
      time:
        index % 3 === 0
          ? '오전 10:00~오전 10:30'
          : index % 3 === 1
            ? '오후 2:00~오후 2:30'
            : '오후 4:00~오후 4:30',
      type: typeOptions[index % typeOptions.length],
      // 기본적으로 모든 새로 생성된 상담은 "예약완료" 상태
      // 특정 상담만 다른 상태로 설정
      status: index === 4 ? '취소완료' : index === 6 ? '상담완료' : '예약완료',
      amount: expert.price,
      paymentMethod: paymentOptions[index % paymentOptions.length],
      paymentDate: `2025.01.${20 - dayOffset}`,
      consultationArea: `${expert.field} 관련 상담`,
      consultationNotes: `${expert.description}에 대한 상세한 상담을 받고 싶습니다. 현재 상황에 맞는 전문적인 조언이 필요합니다.`,
      reviewStatus:
        index === 2 || index === 5
          ? 'available'
          : index === 7
            ? 'completed'
            : undefined,
      // 정렬을 위한 날짜 객체 추가
      dateObject: consultationDate,
    };
  });
};

// 상담 내역에서 가장 빠른 예약완료/상담중 상담 찾기
export const getNextConsultation = (consultations: ConsultationHistory[]) => {
  const upcomingConsultations = consultations
    .filter(c => c.status === '예약완료' || c.status === '상담중')
    .sort((a, b) => {
      // dateObject가 있으면 사용하고, 없으면 날짜 문자열로 비교
      if (a.dateObject && b.dateObject) {
        return a.dateObject.getTime() - b.dateObject.getTime();
      }
      return a.date.localeCompare(b.date);
    });

  return upcomingConsultations[0] || null;
};

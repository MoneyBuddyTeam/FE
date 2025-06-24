import { ChevronRight } from 'lucide-react';
import Text from '../../common/Text';

interface ConsultationData {
  id: number;
  expertName: string;
  expertImage?: string;
  date: string;
  time: string;
  type: string;
  status: string;
  duration: string;
}

interface ConsultationCardProps {
  consultation: ConsultationData;
  onDetailClick: () => void;
  onActionClick: () => void;
}

export default function ConsultationCard({
  consultation,
  onDetailClick,
  onActionClick,
}: ConsultationCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 헤더 - 카드 내부로 이동 */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 14px',
          gap: '10px',
          width: '100%',
          height: '41px',
          background: '#FFFFFF',
          borderBottom: '1px solid #F1F1F1',
          flex: 'none',
          order: 0,
          alignSelf: 'stretch',
          flexGrow: 0,
        }}
      >
        <Text type="H4" className="font-bold">
          {consultation.date}
        </Text>
        <button
          onClick={onDetailClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Pretendard',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '100%',
            letterSpacing: '-2.5%',
            textAlign: 'right',
            color: '#777777',
          }}
        >
          상세보기
          <ChevronRight size={16} color="#777777" />
        </button>
      </div>

      {/* 나머지 콘텐츠 */}
      <div className="p-4">
        {/* 전문가 정보 및 상태 - 새로운 레이아웃 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '12px',
            width: '298px',
            height: '62px',
            flex: 'none',
            order: 0,
            flexGrow: 0,
          }}
        >
          {/* 프로필 이미지 */}
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {consultation.expertImage ? (
              <img
                src={consultation.expertImage}
                alt={consultation.expertName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                👤
              </div>
            )}
          </div>

          {/* 전문가 정보 */}
          <div className="flex-1 flex flex-col gap-1">
            {/* 첫 번째 줄: 이름과 상담 상태 - 요청하신 스타일 적용 */}
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'Pretendard',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                  color: '#000000',
                }}
              >
                {consultation.expertName}
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '2px 5px',
                  gap: '2px',
                  width: '55px',
                  height: '18px',
                  background: 'rgba(100, 136, 255, 0.1)',
                  borderRadius: '4px',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Pretendard',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '14px',
                    textAlign: 'center',
                    color: '#6488FF',
                  }}
                >
                  {consultation.status}
                </span>
              </div>
            </div>

            {/* 두 번째 줄: 상담 시간 */}
            <Text type="B3" className="text-gray-600">
              {consultation.time}
            </Text>

            {/* 세 번째 줄: 전화상담과 소요시간 */}
            <Text type="B3" className="text-gray-600">
              {consultation.type} • {consultation.duration}
            </Text>
          </div>
        </div>

        <div className="mb-4 mt-3">{/* 추가 정보가 필요하면 여기에 */}</div>

        <button
          onClick={onActionClick}
          className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium"
        >
          채팅 바로가기
        </button>
      </div>
    </div>
  );
}

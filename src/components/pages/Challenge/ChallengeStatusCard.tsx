interface Challenge {
  id: number;
  title: string;
  deadline: string;
  progress: number;
  status: 'progress' | 'urgent' | 'completed' | 'expired';
  mentorName: string;
  mentorImage: string;
}

interface ChallengeStatusCardProps {
  challenge: Challenge;
  onDetailClick?: (challengeId: number) => void;
}

// SVG 반원형 진행률 바 컴포넌트
const CircularProgress = ({
  percentage,
  status,
}: {
  percentage: number;
  status: 'progress' | 'urgent' | 'completed' | 'expired';
}) => {
  const getProgressColor = () => {
    switch (status) {
      case 'urgent':
        return '#FF7497';
      case 'completed':
        return '#6488FF';
      case 'expired':
        return '#777777';
      default:
        return '#6488FF';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'completed':
        return '#6488FF';
      default:
        return '#F1F1F1';
    }
  };

  const radius = 32;
  const strokeWidth = 8;
  const center = 40;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        margin: '0 auto',
        width: '80px',
        height: '40px',
        position: 'relative',
      }}
    >
      <svg
        width="80"
        height="40"
        viewBox="0 0 80 40"
        style={{ position: 'absolute', left: '0px', top: '0px' }}
      >
        <path
          d={`M 8 ${center} A ${radius} ${radius} 0 0 1 72 ${center}`}
          fill="none"
          stroke={getBackgroundColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* 진행률 반원 */}
        <path
          d={`M 8 ${center} A ${radius} ${radius} 0 0 1 72 ${center}`}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
            transformOrigin: '40px 40px',
          }}
        />
      </svg>

      {/* 퍼센티지 텍스트 */}
      <div
        style={{
          position: 'absolute',
          width: percentage === 100 ? '43px' : '35px',
          height: '19px',
          left: `calc(50% - ${percentage === 100 ? '43px' : '35px'}/2 + 0.5px)`,
          top: '21px',
          fontFamily: 'Pretendard',
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '35px',
          textAlign: 'center',
          letterSpacing: '-0.025em',
          color: getProgressColor(),
        }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default function ChallengeStatusCard({
  challenge,
  onDetailClick,
}: ChallengeStatusCardProps) {
  const getStatusBadge = () => {
    switch (challenge.status) {
      case 'progress':
        return {
          background: 'rgba(100, 136, 255, 0.1)',
          color: '#6488FF',
          text: '진행중',
          width: '42px',
        };
      case 'urgent':
        return {
          background: 'rgba(255, 116, 151, 0.1)',
          color: '#FF7497',
          text: '종료 D-3',
          width: '55px',
        };
      case 'completed':
        return {
          background: '#6488FF',
          color: '#FFFFFF',
          text: '챌린지 완료',
          width: '65px',
        };
      case 'expired':
        return {
          background: '#E9E9E9',
          color: '#777777',
          text: '챌린지 종료',
          width: '65px',
        };
      default:
        return {
          background: 'rgba(100, 136, 255, 0.1)',
          color: '#6488FF',
          text: '진행중',
          width: '42px',
        };
    }
  };

  const getTitleColor = () => {
    switch (challenge.status) {
      case 'urgent':
        return '#FF7497';
      case 'completed':
        return '#6488FF';
      case 'expired':
        return '#777777';
      default:
        return '#6488FF';
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px',
        width: '350px',
        height: '200px',
        background: '#FFFFFF',
        border: '1px solid #F1F1F1',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        borderRadius: '4px',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 14px',
          gap: '10px',
          width: '350px',
          height: '48px',
          background: '#FFFFFF',
          borderBottom: '1px solid #F1F1F1',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '8px',
            margin: '0 auto',
            width: '145px',
            height: '24px',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundImage: `url(${challenge.mentorImage})`,
              backgroundSize: 'cover',
              borderRadius: '4px',
            }}
          />
          <span
            style={{
              width: '113px',
              height: '17px',
              fontFamily: 'Pretendard',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '17px',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              color: '#191919',
            }}
          >
            {challenge.mentorName} 멘토의 챌린지
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2px 5px',
            gap: '2px',
            margin: '0 auto',
            width: statusBadge.width,
            height: '18px',
            background: statusBadge.background,
            borderRadius: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'Pretendard',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '14px',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              color: statusBadge.color,
            }}
          >
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '16px',
          gap: '40px',
          width: '350px',
          height: '152px',
          background: '#FFFFFF',
        }}
      >
        {/* 프로필 섹션 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px',
            gap: '5px',
            width: '318px',
            height: '40px',
            borderRadius: '진행',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '5px',
              margin: '0 auto',
              width:
                challenge.status === 'urgent'
                  ? '184px'
                  : challenge.status === 'completed'
                    ? '165px'
                    : '143px',
              height: '39px',
            }}
          >
            <div
              style={{
                fontFamily: 'Pretendard',
                fontStyle: 'normal',
                height: '20px',
                fontWeight: 600,
                fontSize: '15px',
                lineHeight: '20px',
                letterSpacing: '-0.025em',
                color: getTitleColor(),
              }}
            >
              {challenge.title}
            </div>
            <div
              style={{
                width: '117px',
                height: '14px',
                fontFamily: 'Pretendard',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '20px',
                letterSpacing: '-0.025em',
                color: '#9C9C9C',
              }}
            >
              {challenge.deadline}
            </div>
          </div>

          <CircularProgress
            percentage={challenge.progress}
            status={challenge.status}
          />
        </div>

        {/* 제출하기 버튼 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '0px',
            gap: '8px',
            width: '318px',
            height: '40px',
          }}
        >
          {' '}
          <button
            onClick={() => {
              if (onDetailClick) {
                onDetailClick(challenge.id);
              } else {
                console.log('챌린지 상세보기:', challenge.id);
              }
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px 22px',
              gap: '10px',
              width: '318px',
              height: '40px',
              background: '#FFFFFF',
              border: '1px solid #F1F1F1',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '101px',
                height: '16px',
                fontFamily: 'Pretendard',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '16px',
                textAlign: 'center',
                letterSpacing: '-0.025em',
                color: '#111111',
              }}
            >
              챌린지 자세히 보기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface ChallengeCardProps {
  title: string;
  deadline: string;
  percentage: number;
  onClick?: () => void;
  status?: 'active' | 'urgent' | 'completed' | 'expired';
}

// 원형 진행률 SVG 컴포넌트 - stroke-dasharray 사용
const CircularProgress = ({
  percentage,
  status = 'active',
}: {
  percentage: number;
  status?: 'active' | 'urgent' | 'completed' | 'expired';
}) => {
  // 반원 경로 계산
  const radius = 32;
  const strokeWidth = 8;
  const center = 40;
  const circumference = Math.PI * radius; // 반원이므로 π * r
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // 상태에 따른 색상 결정
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

  return (
    <div
      style={{
        position: 'absolute',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '80px',
        height: '40px',
      }}
    >
      <svg
        width="80"
        height="40"
        viewBox="0 0 80 40"
        style={{
          position: 'relative',
          left: '0px',
          top: '0px',
        }}
      >
        {/* 배경 반원 */}
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
            transition: 'stroke-dashoffset 0.3s ease-in-out',
          }}
        />
      </svg>

      {/* 퍼센티지 텍스트 - 절대 위치로 고정 */}
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
          lineHeight: '30px',
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

export default function ChallengeCard({
  title,
  deadline,
  percentage,
  onClick,
  status = 'active',
}: ChallengeCardProps) {
  // 상태에 따른 배경색 결정
  const getBackgroundColor = () => {
    switch (status) {
      case 'urgent':
        return '#FFF4F6';
      case 'completed':
        return '#F5F8FF';
      case 'expired':
        return '#F1F1F1';
      default:
        return '#F5F8FF';
    }
  };

  // 상태에 따른 제목 색상 결정
  const getTitleColor = () => {
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

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '16px 15px',
        width: '350px',
        height: '72px',
        background: getBackgroundColor(),
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* 텍스트 섹션 - 차트 공간을 확보하여 고정 너비 설정 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '5px',
          width: 'calc(100% - 110px)', // 차트 영역(80px + 여백 30px) 제외
          height: '39px',
          paddingRight: '10px',
        }}
      >
        {/* 챌린지 제목 */}
        <div
          style={{
            width: '100%',
            height: '20px',
            fontFamily: 'Pretendard',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: '-0.025em',
            color: getTitleColor(),
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>

        {/* 마감일 */}
        <div
          style={{
            width: '100%',
            height: '14px',
            fontFamily: 'Pretendard',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '14px',
            letterSpacing: '-0.025em',
            color: '#9C9C9C',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {deadline}
        </div>
      </div>

      {/* 원형 진행률 차트 - 절대 위치로 고정 */}
      <CircularProgress percentage={percentage} status={status} />
    </div>
  );
}

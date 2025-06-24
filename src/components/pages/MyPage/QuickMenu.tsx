import { mypageStateStyles } from '../../../styles/mypage-state.styles';

interface QuickMenuProps {
  onChallengeClick: () => void;
  onConsultationClick: () => void;
  onExpertClick: () => void;
  onClassClick: () => void;
}

export default function QuickMenu({
  onChallengeClick,
  onConsultationClick,
  onExpertClick,
  onClassClick,
}: QuickMenuProps) {
  const menuItems = [
    {
      icon: '/jpg/icon/paymentsuccess.png',
      label: '챌린지 현황',
      onClick: onChallengeClick,
    },
    {
      icon: '/jpg/icon/image-1.png',
      label: '상담 내역',
      onClick: onConsultationClick,
    },
    {
      icon: '/jpg/icon/image 56.png',
      label: '엑스퍼트',
      onClick: onExpertClick,
    },
    {
      icon: '/jpg/icon/image 52.png',
      label: '마이클래스',
      onClick: onClassClick,
    },
  ];
  return (
    <div className={mypageStateStyles.quickMenu.container}>
      {menuItems.map(item => (
        <div key={item.label}>
          <div
            className={mypageStateStyles.quickMenu.item}
            onClick={item.onClick}
          >
            <img
              src={item.icon}
              alt={item.label}
              className={mypageStateStyles.quickMenu.icon}
            />
            <span className={mypageStateStyles.quickMenu.text}>
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

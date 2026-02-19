import { useNavigate } from 'react-router-dom';
import SuccessIcon from '../../assets/icons/common/sucess.png';
import Button from '../../components/common/Button';

export default function ChallengeSubmitSuccessPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <img src={SuccessIcon} alt="제출 완료" className="w-40 h-40 mb-6" />

      <div className="text-h2 text-black mb-1">
        챌린지 제출 수고하셨습니다 💪
      </div>
      <p className="text-h2 text-[#6488FF] mb-10">
        곧 엑스퍼트님이 평가해주실 거예요
      </p>
      <Button
        className="fixed bottom-0 mb-8"
        variant="primary"
        onClick={handleClick}
      >
        확인
      </Button>
    </div>
  );
}

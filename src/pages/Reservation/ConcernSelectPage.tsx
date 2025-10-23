import type { JSX } from 'react';
import Button from '../../components/common/Button';
import ConcernCard from '../../components/pages/Reservation/ConcernCard';
import { concernOptions } from '../../data/concernOptionData';
import { useReservationStore } from '../../stores/useReservationStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ConcernSelectPage(): JSX.Element {
  const { selectedConcern, setSelectedConcern, expert } = useReservationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!expert) {
      navigate(-1);
    }
  }, [expert, navigate]);

  return (
    <div>
      <div className="text-h3 text-center my-6">
        현재 가지고 있는 고민을 선택해주세요.
      </div>
      <div className="mx-6 lg:mx-2">
        {concernOptions.map(option => (
          <ConcernCard
            key={option.key}
            title={option.title}
            description={option.description}
            isSelected={selectedConcern === option.key}
            onClick={() => setSelectedConcern(option.key)}
          />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 w-full p-4 mb-2 bg-white">
        <div className="flex items-center justify-center max-w-md mx-auto px-4">
          <Button
            variant={selectedConcern ? 'primary' : 'disabled'}
            onClick={() => {
              if (selectedConcern) {
                navigate('/reservation/step2');
              }
            }}
            className="flex-1 h-[46px] flex items-center justify-center border"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}

import { type JSX } from 'react';
import Button from '../../common/Button';
import { useReservationStore } from '../../../stores/useReservationStore';

export default function MethodSelector(): JSX.Element {
  const { consultMethod, setConsultMethod } = useReservationStore();

  return (
    <div className="my-6 mx-4">
      <div className="text-h3 my-4">상담 방식 선택</div>
      <div className="flex gap-2">
        <Button
          variant={consultMethod === 'chat' ? 'text' : 'text2'}
          className={`flex-1 py-4 rounded border ${
            consultMethod === 'chat' ? 'border-[#6488FF]' : 'border-gray-200'
          }`}
          onClick={() => setConsultMethod('chat')}
        >
          채팅 상담
        </Button>
        <Button
          variant={consultMethod === 'call' ? 'text' : 'text2'}
          className={`flex-1 py-4 rounded border ${
            consultMethod === 'call' ? 'border-[#6488FF]' : 'border-gray-200'
          }`}
          onClick={() => setConsultMethod('call')}
        >
          전화 상담
        </Button>
      </div>
    </div>
  );
}

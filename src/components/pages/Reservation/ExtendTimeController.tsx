import type { JSX } from 'react';
import { useReservationStore } from '../../../stores/useReservationStore';
import { Minus, Plus } from 'lucide-react';
import Button from '../../common/Button';

export default function ExtendTimeController(): JSX.Element {
  const {
    extendMinutes,
    needExtend,
    increaseExtend,
    decreaseExtend,
    toggleNeedExtend,
  } = useReservationStore();

  const isDisabled = !needExtend;

  return (
    <div className="mx-4 my-2">
      <div className="text-h3 my-2">상담 시간 연장</div>

      <p className="text-b3 text-[#777777] mb-4">
        상담은 기본 15분이며, 15분씩 연장해 최대 1시간까지 예약할 수 있어요.
      </p>

      <div
        className={`
          flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 mb-4
          ${isDisabled ? 'opacity-50 bg-gray-50' : ''}
        `}
      >
        <span className="text-b2 text-black">연장 상담</span>

        <div className="flex items-center gap-2">
          <Button
            variant="text2"
            className="border w-7 h-7 text-black flex justify-center items-center disabled:opacity-30"
            onClick={decreaseExtend}
            disabled={isDisabled || extendMinutes <= 15}
          >
            <Minus size={14} />
          </Button>
          <span className="text-b2">{extendMinutes} 분</span>
          <Button
            variant="text2"
            className="border w-7 h-7 text-black flex justify-center items-center disabled:opacity-30"
            onClick={increaseExtend}
            disabled={isDisabled || extendMinutes >= 60}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      <label className="flex items-center text-b3 gap-2 text-[#777777]">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#6488FF]"
          checked={!needExtend}
          onChange={toggleNeedExtend}
        />
        연장 상담이 필요 없어요. 15분만 상담할래요.
      </label>
    </div>
  );
}

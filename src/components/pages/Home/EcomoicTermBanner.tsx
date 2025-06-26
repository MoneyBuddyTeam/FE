import { Book } from 'lucide-react';
import type { JSX } from 'react';
import Button from '../../common/Button';

export default function EcomoicTermBanner(): JSX.Element {
  return (
    <div className="bg-[#BC64FF] px-5 py-4 mx-4 my-5 rounded-md">
      <div className="flex">
        <Book size={14} className="text-white" />
        <div className="text-b3 text-white">오늘의 경제 용어</div>
      </div>
      <div className="flex justify-between ">
        <div className="text-h1 text-[#FFFFFF]">
          ETF<span className="text-b1">(Exchange Traded Fund)</span>
        </div>
        <Button
          variant="text"
          className="bg-[#C987F6] border text-white text-sm rounded-full px-5 py-1"
        >
          학습하기
        </Button>
      </div>
    </div>
  );
}

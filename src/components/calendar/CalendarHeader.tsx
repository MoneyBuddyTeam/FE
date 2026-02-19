import type { JSX } from 'react';
import Button from '../common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  thisYear: number;
  thisMonth: number;
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
}

export default function CalendarHeader({
  thisYear,
  thisMonth,
  onPrev,
  onNext,
  disablePrev,
}: CalendarHeaderProps): JSX.Element {
  const formatMonth = String(thisMonth + 1).padStart(2, '0');

  return (
    <div className="rounded-[30px] border py-2 flex justify-between px-4 items-center mx-2">
      <Button variant="text2" onClick={onPrev} disabled={disablePrev}>
        <ChevronLeft />
      </Button>
      <span className="text-b1 font-semibold">
        {thisYear}. {formatMonth}
      </span>
      <Button variant="text2" onClick={onNext}>
        <ChevronRight />
      </Button>
    </div>
  );
}

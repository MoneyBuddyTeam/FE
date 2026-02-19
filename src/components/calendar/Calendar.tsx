import type { JSX } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { useCalendarStore } from '../../stores/useCalendarStore';

export default function Calendar(): JSX.Element {
  const { year, month, goToPrevMonth, goToNextMonth, isCurrentMonth } =
    useCalendarStore();

  return (
    <div>
      <div className="text-h3 my-4 mx-4">상담 일자 선택</div>
      <CalendarHeader
        thisYear={year}
        thisMonth={month}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        disablePrev={isCurrentMonth()}
      />
      <CalendarGrid year={year} month={month} />
    </div>
  );
}

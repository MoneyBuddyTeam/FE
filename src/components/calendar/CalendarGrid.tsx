import type { JSX } from 'react';
import { useReservationStore } from '../../stores/useReservationStore';

interface CalendarGridProps {
  year?: number;
  month?: number;
}

export default function CalendarGrid({
  year,
  month,
}: CalendarGridProps): JSX.Element {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const { setSelectedDate, selectedDate } = useReservationStore();

  if (year === undefined || month === undefined) return <></>;

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = Array.from(
    { length: firstDay + daysInMonth },
    (_, i) => {
      if (i < firstDay) return null;
      return i - firstDay + 1;
    },
  );

  return (
    <div className="grid grid-cols-7 text-center text-b1 lg:text-lg my-3 gap-y-2 mx-2">
      {days.map(day => (
        <div key={day} className="font-semibold">
          {day}
        </div>
      ))}

      {calendarCells.map((date, index) => {
        if (date === null) return <div key={index}></div>;

        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const isPast = new Date(fullDate) < new Date(todayString);
        const isToday = fullDate === todayString;
        const isSelected = selectedDate === fullDate;

        return (
          <div
            key={index}
            className={`w-10 h-10 lg:w-14 lg:h-14 flex flex-col items-center justify-center rounded-xl
    					${isPast ? 'text-[#9C9C9C] cursor-default' : 'cursor-pointer'}
    					${isSelected ? 'bg-[#6488FF] text-white' : ''}
    					${!isPast && !isSelected ? 'hover:bg-blue-100' : ''}
  					`}
            onClick={() => {
              if (!isPast) {
                setSelectedDate(fullDate);
              }
            }}
          >
            <span className="text-sm lg:text-base font-medium">{date}</span>

            {isToday && !isPast && (
              <span className="text-[10px] lg:text-xs font-medium leading-none mt-0.5">
                오늘
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

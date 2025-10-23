import type { JSX } from 'react';
import TimeUnitButton from './TimeUnitButton';

export default function TimeSelector(): JSX.Element {
  const morningTimes = ['10:00', '11:00', '12:00'];
  const afternoonTimes = ['02:00', '03:00', '04:00', '05:00', '06:00', '07:00'];

  return (
    <div className="mx-4 my-4">
      <div className="text-h3 my-2">상담 시간 선택</div>
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-b2 mb-2">오전</p>
          <div className="grid grid-cols-3 gap-2">
            {morningTimes.map(time => (
              <TimeUnitButton key={time} time={time} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-b2 mb-2">오후</p>
          <div className="grid grid-cols-3 gap-2">
            {afternoonTimes.map(time => (
              <TimeUnitButton key={time} time={time} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// // components/pages/Reservation/TimeSelector.tsx
// import { useReservationStore } from '../../../stores/useReservationStore';

// const amHours24 = [10, 11, 12]; // 오전 10, 11, 12시
// const pmHours24 = [14, 15, 16, 17, 18, 19]; // 오후 2~7시 (24시간제)

// const display12 = (h24: number) => {
//   // 24h -> "hh:00" (12시간제로 표기, 0패딩)
//   let h12 = h24 % 12;
//   if (h12 === 0) h12 = 12;
//   return `${String(h12).padStart(2, '0')}:00`;
// };

// export default function TimeSelector() {
//   const { selectedTime, setSelectedTime } = useReservationStore();

//   const handleClick = (h24: number) => {
//     const value = `${String(h24).padStart(2, '0')}:00`; // ✅ 24시간제로 저장
//     setSelectedTime(value);
//   };

//   const isSelected = (h24: number) =>
//     selectedTime === `${String(h24).padStart(2, '0')}:00`;

//   return (
//     <div className="px-4">
//       <div className="text-b2 mb-2">오전</div>
//       <div className="grid grid-cols-3 gap-3 mb-4">
//         {amHours24.map(h => (
//           <button
//             key={h}
//             onClick={() => handleClick(h)}
//             className={`border rounded-lg py-3 ${
//               isSelected(h)
//                 ? 'border-[#6488FF] text-[#6488FF]'
//                 : 'border-gray-200'
//             }`}
//           >
//             {display12(h)}
//           </button>
//         ))}
//       </div>

//       <div className="text-b2 mb-2">오후</div>
//       <div className="grid grid-cols-3 gap-3">
//         {pmHours24.map(h => (
//           <button
//             key={h}
//             onClick={() => handleClick(h)}
//             className={`border rounded-lg py-3 ${
//               isSelected(h)
//                 ? 'border-[#6488FF] text-[#6488FF]'
//                 : 'border-gray-200'
//             }`}
//           >
//             {display12(h)}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

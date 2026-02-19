import { CalendarCheck2 } from 'lucide-react';
import type { JSX } from 'react';

interface Props {
  consultationDate: string;
  consultationTime: string;
}

export default function ReservationSummary({
  consultationDate,
  consultationTime,
}: Props): JSX.Element {
  return (
    <div
      className="flex justify-center items-center gap-2 px-4 py-3 mt-4 text-sm text-[#BC64FF] border rounded bg-clip-padding"
      style={{
        background:
          'linear-gradient(90deg, rgba(188, 100, 255, 0.1), rgba(255, 116, 151, 0.1))',
        border: '1px solid',
        borderImage: 'linear-gradient(to right, #BC64FF, #FF7497)',
        borderImageSlice: 1,
      }}
    >
      <CalendarCheck2 size={16} />
      <div className="flex gap-2">
        <span className="text-b2 font-semibold">{consultationDate}</span>
        <span className="text-b2 font-semibold">{consultationTime}</span>
      </div>
    </div>
  );
}

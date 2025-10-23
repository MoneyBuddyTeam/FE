import type { JSX } from 'react';

interface CounsultContentProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function ConsultContentInput({
  value,
  onChange,
  maxLength = 2000,
}: CounsultContentProps): JSX.Element {
  return (
    <div>
      <div className="flex justify-center my-6">
        <textarea
          onChange={e => onChange(e.target.value)}
          value={value}
          className="w-[350px] h-[374px] border p-1"
          maxLength={maxLength}
        ></textarea>
      </div>
      <div className="absolute right-0 text-xs text-[#9C9C9C] mr-4">
        {value.length}/{maxLength}자
      </div>
    </div>
  );
}

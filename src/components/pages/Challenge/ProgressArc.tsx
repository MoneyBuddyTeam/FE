interface ProgressArcProps {
  date: string;
  percent: number;
}

export default function ProgressArc({ date, percent }: ProgressArcProps) {
  const radius = 60;
  const strokeWidth = 10;
  const cx = 100;
  const cy = 100;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center mb-6">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#E9E9E9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#3B4EFF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />

        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="#9C9C9C"
          fontSize="12"
        >
          {date} 까지
        </text>

        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="#3B4EFF"
          fontSize="20"
          fontWeight="bold"
        >
          {percent}%
        </text>
      </svg>
    </div>
  );
}

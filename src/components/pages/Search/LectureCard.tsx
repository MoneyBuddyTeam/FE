interface Lecture {
  id: number;
  title: string;
  description: string;
  level: '입문' | '고급' | '중급';
  thumbnail: string;
}

export default function LectureCard({ lecture }: { lecture: Lecture }) {
  const levelColor = {
    입문: 'bg-blue-100 text-blue-600',
    고급: 'bg-red-100 text-red-600',
    중급: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="flex gap-3 p-3 bg-white rounded-lg shadow-sm mb-2">
      <img
        src={lecture.thumbnail}
        alt={lecture.title}
        className="w-16 h-16 rounded-md"
      />
      <div className="flex flex-col justify-between">
        <div className="text-xs font-semibold">{lecture.title}</div>
        <div className="text-xs text-gray-500">{lecture.description}</div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded ${levelColor[lecture.level]}`}
        >
          {lecture.level}
        </span>
      </div>
    </div>
  );
}

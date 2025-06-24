import { ChevronLeft, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  keyword: string;
  onChange: (text: string) => void;
  onSubmit: (text: string) => void;
}

export default function SearchBar({
  keyword,
  onChange,
  onSubmit,
}: SearchBarProps) {
  const handleClear = () => onChange('');
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => navigate(-1)}>
        <ChevronLeft size={24} />
      </button>

      <div className="relative w-full">
        <input
          type="text"
          value={keyword}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit(keyword)}
          placeholder="금융/경제 콘텐츠를 검색해보세요! (예: 앱테크, 연금)"
          className="w-full h-10 pl-4 pr-10 text-sm text-black rounded-full border border-[#E5E7EB] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6488FF] placeholder:text-[#999999] placeholder:truncate"
        />
        {keyword ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <X size={18} />
          </button>
        ) : (
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
      </div>
    </div>
  );
}

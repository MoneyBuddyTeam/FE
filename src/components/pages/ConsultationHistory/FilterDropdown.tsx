import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  options: readonly string[];
}

export default function FilterDropdown({
  selectedFilter,
  onFilterChange,
  options,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSelect = (filter: string) => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* 필터 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row justify-center items-center p-0 gap-1 box-border border border-primary rounded-lg px-3 py-2 w-[95px] h-[32px]"
      >
        <span className="font-normal text-[12px] leading-[14px] tracking-[-0.025em] text-primary flex items-center justify-center">
          {selectedFilter}
        </span>
        <ChevronDown
          size={16}
          className={`text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-[36px] right-0 flex flex-col bg-white border border-gray-200 rounded-lg shadow-md z-10 py-2 min-w-[95px]">
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleFilterSelect(option)}
              className={`px-4 py-2  text-[12px]  text-left hover:bg-gray-50 transition-colors ${
                option === selectedFilter ? 'text-primary' : 'text-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

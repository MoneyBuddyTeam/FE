interface SuggestListProps {
  keyword: string;
  suggestions: string[];
  onSelect: (value: string) => void;
}

export default function SuggestList({
  keyword,
  suggestions,
  onSelect,
}: SuggestListProps) {
  return (
    <div className="absolute w-full mt-1 bg-white border rounded-lg shadow z-10">
      {suggestions.map(suggestion => (
        <div
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
        >
          <span className="text-[#6488FF]">{keyword}</span>
          {suggestion.replace(keyword, '')}
        </div>
      ))}
    </div>
  );
}

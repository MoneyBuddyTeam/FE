import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import SuggestList from './SuggestList';
import SearchTagList from './SearchTagList';
import { getSuggestList } from '../../../services/search/searchApi';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword.trim()) {
        setIsTyping(true);
        getSuggestList(keyword).then(setSuggestions);
      } else {
        setIsTyping(false);
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSelect = (value: string) => {
    setKeyword(value);
    setIsTyping(false);
    console.log('검색 실행:', value);
    navigate(`/search/result?keyword=${encodeURIComponent(value)}`);
  };

  return (
    <div className="px-4 pt-6 relative">
      <SearchBar
        keyword={keyword}
        onChange={setKeyword}
        onSubmit={handleSelect}
      />

      {isTyping && suggestions.length > 0 && (
        <SuggestList
          keyword={keyword}
          suggestions={suggestions}
          onSelect={handleSelect}
        />
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-2">추천 검색어</h2>
        <SearchTagList onTagClick={handleSelect} />

        <h2 className="text-sm font-semibold mt-6 mb-2">인기 검색어</h2>
        <SearchTagList onTagClick={handleSelect} />
      </div>
    </div>
  );
}

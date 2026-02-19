import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchBar from '../../components/pages/Search/SearchBar';
import SearchResultTabs from '../../components/pages/Search/SearchResultTabs';
import ExpertCard from '../../components/pages/Expert/ExpertCard';
import LectureCard from '../../components/pages/Search/LectureCard';
import CommunityCard from '../../components/pages/Search/CommunityCard';
import MegazineCard from '../../components/pages/Search/MegazineCard';
import EmptyResult from '../../components/pages/Search/EmptyResult';
import SuggestList from '../../components/pages/Search/SuggestList';
import { getSuggestList } from '../../services/search/searchApi';
import { useSearch } from '../../hooks/useSearch';

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { experts, lectures, megazines, community, totalCounts } =
    useSearch(keyword);

  const [activeTab, setActiveTab] = useState<
    'total' | 'experts' | 'lectures' | 'megazines' | 'community'
  >('total');

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

  useEffect(() => {
    const newKeyword = searchParams.get('keyword') || '';
    setKeyword(newKeyword);
  }, [searchParams]);

  const handleSubmit = (newKeyword: string) => {
    const encoded = encodeURIComponent(newKeyword.trim());
    if (!encoded) return;
    navigate(`/search/result?keyword=${encoded}`);
    setKeyword(newKeyword);
    setIsTyping(false);
  };

  const isEmpty =
    experts.length === 0 &&
    lectures.length === 0 &&
    megazines.length === 0 &&
    community.length === 0;

  return (
    <div className="px-4 pt-4 relative">
      <SearchBar
        keyword={keyword}
        onChange={setKeyword}
        onSubmit={handleSubmit}
      />

      {isTyping && suggestions.length > 0 && (
        <SuggestList
          keyword={keyword}
          suggestions={suggestions}
          onSelect={handleSubmit}
        />
      )}

      <SearchResultTabs
        counts={totalCounts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {isEmpty ? (
        <EmptyResult />
      ) : (
        <>
          {(activeTab === 'total' || activeTab === 'experts') && (
            <section className="mt-6">
              <h2 className="font-semibold text-base mb-2">
                엑스퍼트 ({experts.length})
                <button className="float-right text-sm text-[#666]">
                  더보기
                </button>
              </h2>
              {experts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} variant="search" />
              ))}
            </section>
          )}

          {(activeTab === 'total' || activeTab === 'lectures') && (
            <section className="mt-6">
              <h2 className="font-semibold text-base mb-2">
                강의 ({lectures.length})
                <button className="float-right text-sm text-[#666]">
                  더보기
                </button>
              </h2>
              {lectures.map(lecture => (
                <LectureCard key={lecture.id} lecture={lecture} />
              ))}
            </section>
          )}

          {(activeTab === 'total' || activeTab === 'megazines') && (
            <section className="mt-6">
              <h2 className="font-semibold text-base mb-2">
                매거진 ({megazines.length})
              </h2>
              {megazines.map(megazine => (
                <MegazineCard key={megazine.id} megazine={megazine} />
              ))}
            </section>
          )}

          {(activeTab === 'total' || activeTab === 'community') && (
            <section className="mt-6">
              <h2 className="font-semibold text-base mb-2">
                커뮤니티 ({community.length})
              </h2>
              {community.map(post => (
                <CommunityCard key={post.id} post={post} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

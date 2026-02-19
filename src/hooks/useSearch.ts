import { useEffect, useState } from 'react';
import { searchAll } from '../services/search/searchApi';

interface Expert {
  id: number;
  name: string;
  tags: string[];
  description: string;
  profileImage: string;
  imgUrl: string;
}

interface Lecture {
  id: number;
  title: string;
  level: '입문' | '중급' | '고급';
  description: string;
  thumbnail: string;
}

export interface Megazine {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  thumbnail: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  views: number;
  comments: number;
  badge?: string;
}

interface SearchResult {
  experts: Expert[];
  lectures: Lecture[];
  megazines: Megazine[];
  community: CommunityPost[];
}

export function useSearch(keyword: string) {
  const [data, setData] = useState<SearchResult>({
    experts: [],
    lectures: [],
    megazines: [],
    community: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!keyword.trim()) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const result: SearchResult = await searchAll(keyword);
        console.log('📦 원본 응답:', result);

        const lowerKeyword = keyword.toLowerCase();

        const filteredData: SearchResult = {
          experts: result.experts.filter(
            (e: Expert) =>
              e.name.toLowerCase().includes(lowerKeyword) ||
              e.description.toLowerCase().includes(lowerKeyword),
          ),
          lectures: result.lectures.filter(
            (l: Lecture) =>
              l.title.toLowerCase().includes(lowerKeyword) ||
              l.description.toLowerCase().includes(lowerKeyword),
          ),
          megazines: result.megazines.filter(
            (m: Megazine) =>
              m.title.toLowerCase().includes(lowerKeyword) ||
              m.description.toLowerCase().includes(lowerKeyword),
          ),
          community: result.community.filter((c: CommunityPost) =>
            c.title.toLowerCase().includes(lowerKeyword),
          ),
        };

        setData(filteredData);
        setError(null);
      } catch (err) {
        console.error('검색 실패:', err);
        setError('검색에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [keyword]);

  const totalCounts = {
    total:
      data.experts.length +
      data.lectures.length +
      data.megazines.length +
      data.community.length,
    experts: data.experts.length,
    lectures: data.lectures.length,
    megazines: data.megazines.length,
    community: data.community.length,
  };

  return { ...data, totalCounts, loading, error };
}

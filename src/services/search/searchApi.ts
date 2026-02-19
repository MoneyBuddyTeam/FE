export async function getSuggestList(keyword: string): Promise<string[]> {
  const res = await fetch(
    `/api/v1/search/suggestions?keyword=${encodeURIComponent(keyword)}`,
  );

  if (!res.ok) throw new Error('추천 검색어 요청 실패');

  return res.json();
}

export async function searchAll(keyword: string) {
  const res = await fetch(
    `/api/v1/search?keyword=${encodeURIComponent(keyword)}`,
  );

  if (!res.ok) {
    throw new Error('검색 결과 요청 실패');
  }

  return res.json();
}

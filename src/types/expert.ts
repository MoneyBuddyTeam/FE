export type ExpertField = '소비' | '저축' | '투자' | '부채' | '기타';
export type SortType =
  | '최신순'
  | '북마크순'
  | '평점순'
  | '상담건순'
  | '낮은가격순'
  | '높은가격순'
  | '이름순'
  | '리뷰많은순';

export type Field = ExpertField;

// 전문가 필터링 파라미터 타입
export interface ExpertFilterParams {
  category_id?: string;
  is_online?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string; // search 속성 추가
}

// 전문가 목록 응답 타입
export interface ExpertListResponse {
  advisors?: Expert[];
  experts?: Expert[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// 카테고리 응답 타입
export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
}

// 정렬 옵션 타입
export type SortOptionType =
  | '평점순'
  | '리뷰많은순'
  | '낮은가격순'
  | '높은가격순'
  | string;

// 전문가 타입
export interface Expert {
  id: number;
  nickname: string;
  field: ExpertField;
  category: ExpertField;
  rating: number;
  price: number;
  experience: number;
  consultation_count: number;
  review_count: number;
  bookmarks: number;
  profile_image: string;
  description: string;
  bio: string;
  is_online: boolean;
  hashtags: string[];
  isBookmarked?: boolean;
  // 상세 정보 (선택적)
  skills?: string[];
  education?: string[];
  career?: string[];
  contact_hours?: string;
  response_time?: string;
  consultation_formats?: string[];
}

// 북마크 관련 타입 정의

export interface BookmarkToggleRequest {
  expertId: number;
}

export interface BookmarkToggleResponse {
  bookmarked: boolean;
  message: string;
  expertId: number;
}

export interface BookmarkedExpert {
  expertId: number;
  expertName: string;
  field: string;
  description: string;
  profileImage?: string;
  rating?: number;
  reviewCount?: number;
}

export interface BookmarkListResponse {
  bookmarks: BookmarkedExpert[];
}

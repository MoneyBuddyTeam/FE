import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getBookmarksApi,
  toggleBookmarkApi,
  removeBookmarkApi,
} from '../services/bookmarks/bookmarkApi';
import type { BookmarkToggleResponse } from '../types/bookmark';
import type { Expert } from '../types/expert';

// 북마크 목록 조회
export const useBookmarksQuery = () => {
  return useQuery<Expert[]>({
    queryKey: ['bookmarks'],
    queryFn: getBookmarksApi,
  });
};

// 북마크 토글 (추가/제거)
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation<BookmarkToggleResponse, Error, number>({
    mutationFn: toggleBookmarkApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['experts'] });
    },
  });
};

// 북마크 제거
export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation<BookmarkToggleResponse, Error, number>({
    mutationFn: removeBookmarkApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};

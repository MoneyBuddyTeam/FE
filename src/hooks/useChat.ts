import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { fetchMessages, markAsRead } from '../services/chat/chatApi';

// ✅ 채팅 메시지 무한스크롤 로딩
export const useChatMessages = (roomId: number) => {
  return useInfiniteQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: ({ pageParam = 0 }) => fetchMessages(roomId, pageParam),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.last ? undefined : lastPage.messages.length;
    },
    refetchOnWindowFocus: false,
  });
};

// ✅ 메시지 읽음 처리 Hook
export const useMarkMessageAsRead = () => {
  return useMutation({
    mutationFn: ({ messageId }: { messageId: number }) =>
      markAsRead({ messageId }),
  });
};

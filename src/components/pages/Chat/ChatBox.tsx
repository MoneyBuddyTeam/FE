import { useEffect, useRef, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import 'dayjs/locale/ko';

import ChatMessageCard from './ChatMessageCard';
import { useChatStore } from '../../../stores/useChatStore';
import { useMarkMessageAsRead, useChatMessages } from '../../../hooks/useChat';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.locale('ko');

const getDateLabel = (dateStr: string) => {
  const date = dayjs(dateStr);
  if (date.isToday()) return '오늘';
  if (date.isYesterday()) return '어제';
  return date.format('YYYY년 M월 D일 (ddd)');
};

export default function ChatBox({
  roomId,
  myId,
}: {
  roomId: number;
  myId: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);

  const { messages, setMessages, setReplyTarget, searchTerm } = useChatStore();

  const { mutate: markAsReadMutate } = useMarkMessageAsRead();
  const { data, fetchNextPage, hasNextPage } = useChatMessages(roomId);

  const flatMessages = useMemo(() => {
    return data?.pages.flatMap(page => page.messages).reverse() || [];
  }, [data]);

  useEffect(() => {
    setMessages(flatMessages);
  }, [flatMessages, setMessages]);

  const lastMyMessageId = useMemo(() => {
    const reversed = [...messages].reverse();
    const lastMine = reversed.find(msg => msg.senderId === myId);
    return lastMine?.messageId;
  }, [messages, myId]);

  useEffect(() => {
    if (!hasMarkedAsRead && messages.length > 0) {
      const lastReceived = [...messages]
        .reverse()
        .find(m => m.senderId !== myId);
      if (lastReceived) {
        markAsReadMutate({ messageId: lastReceived.messageId });
        setHasMarkedAsRead(true);
      }
    }
  }, [messages, hasMarkedAsRead, markAsReadMutate, myId]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || el.scrollTop > 10 || !hasNextPage) return;

    prevScrollHeightRef.current = el.scrollHeight;
    fetchNextPage().then(() => {
      setTimeout(() => {
        if (el) {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - prevScrollHeightRef.current;
        }
      }, 50);
    });
  };

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages;
    return messages.filter(msg =>
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [messages, searchTerm]);

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, idx) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={idx} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        <span key={idx}>{part}</span>
      ),
    );
  };

  return (
    <div
      id="consultation-messages"
      ref={containerRef}
      className="flex flex-col gap-2 overflow-y-auto p-4 h-full bg-white"
      onScroll={handleScroll}
    >
      {filteredMessages.map((msg, idx) => {
        const isMine = msg.senderId === myId;
        const prev = filteredMessages[idx - 1];
        const showMeta = !prev || msg.senderId !== prev.senderId;
        const showDateDivider =
          !prev || !dayjs(msg.sentAt).isSame(dayjs(prev.sentAt), 'day');
        const isLastMessage = idx === filteredMessages.length - 1;

        return (
          <div key={`msg-${msg.messageId || idx}`}>
            {showDateDivider && (
              <div className="flex items-center justify-center my-4">
                <div className="flex-grow border-t border-gray-300 mx-2" />
                <span className="text-xs text-gray-500">
                  {getDateLabel(msg.sentAt)}
                </span>
                <div className="flex-grow border-t border-gray-300 mx-2" />
              </div>
            )}
            <ChatMessageCard
              message={msg}
              isMine={isMine}
              isRead={msg.isReadByReceiver}
              isLastMine={msg.messageId === lastMyMessageId}
              isLastMessage={isLastMessage}
              showMeta={showMeta}
              showMenu={activeMenuId === idx}
              onToggleMenu={() =>
                setActiveMenuId(activeMenuId === idx ? null : idx)
              }
              onDelete={() => alert('삭제는 구현 예정')}
              onReply={setReplyTarget}
              renderCustomText={
                searchTerm ? highlightText(msg.message, searchTerm) : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
}

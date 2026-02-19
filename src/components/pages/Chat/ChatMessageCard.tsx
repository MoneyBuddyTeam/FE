import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { ConsultationMessage } from '../../../types';
import ChallengeInviteMessage from '../Challenge/ChallengeInviteMessage';

interface Props {
  message: ConsultationMessage;
  isMine: boolean;
  isRead?: boolean;
  isLastMine?: boolean;
  isLastMessage?: boolean;
  showMeta: boolean;
  showMenu: boolean;
  onToggleMenu: () => void;
  onDelete?: () => void;
  onReply?: (message: ConsultationMessage) => void;
  renderCustomText?: React.ReactNode;
}

export default function ChatMessageCard({
  message,
  isMine,
  showMeta,
  showMenu,
  onToggleMenu,
  onDelete,
  onReply,
  renderCustomText,
}: Props) {
  const fallbackProfileUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${message.senderId}`;
  const profileImageUrl =
    message.type === 'IMAGE' && message.imageUrl
      ? message.imageUrl
      : fallbackProfileUrl;

  const formattedTime = dayjs(message.sentAt).format('A h:mm');

  const messageWrapperRef = useRef<HTMLDivElement>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = messageWrapperRef.current;
      if (el) {
        const overflowed = el.scrollHeight > el.clientHeight;
        setIsOverflowed(overflowed);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [message.message, showFull]);

  const isChallengeInvite =
    message.type === 'CHALLENGE_INVITE' &&
    typeof message.challengeId === 'number';

  return (
    <div
      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} mb-3`}
    >
      {showMeta && (
        <div className="text-center text-xs text-gray-400 my-2">
          {dayjs(message.sentAt).format('YYYY.MM.DD')}
        </div>
      )}

      <div
        className={`flex ${
          isMine ? 'justify-end flex-row-reverse' : 'justify-start'
        } gap-2 max-w-[80%]`}
      >
        {showMeta && !isMine && (
          <img
            src={profileImageUrl}
            alt="profile"
            className="w-8 h-8 rounded-full border"
          />
        )}

        <div className="relative">
          {/* ✅ 챌린지 초대 메시지 */}
          {isChallengeInvite ? (
            <ChallengeInviteMessage
              message={message.message}
              sentAt={formattedTime}
              challengeId={message.challengeId!}
            />
          ) : (
            <>
              <div
                className={`px-4 py-2 text-sm leading-[20px] max-w-[320px] whitespace-pre-wrap break-words rounded-xl shadow w-full ${
                  isMine
                    ? 'bg-[#6488FF] text-white rounded-br-none'
                    : 'bg-[#F2F3F5] text-black rounded-bl-none'
                }`}
                onClick={onToggleMenu}
              >
                {message.replyToMessage && (
                  <div
                    className={`mb-1 p-2 rounded-md text-xs truncate ${
                      isMine
                        ? 'bg-[#5c7ae7] text-white/70'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {message.replyToMessage.message} 에 답장
                  </div>
                )}
                <div
                  ref={messageWrapperRef}
                  className={`${
                    !showFull && isOverflowed
                      ? 'overflow-hidden max-h-[540px]'
                      : ''
                  }`}
                >
                  {message.type === 'IMAGE' ? (
                    <img
                      src={message.imageUrl ?? ''}
                      alt="보낸 이미지"
                      className="max-w-xs max-h-40 rounded"
                    />
                  ) : (
                    (renderCustomText ?? message.message)
                  )}
                </div>
              </div>

              <div className="text-[10px] text-gray-500 mt-1 text-right">
                {formattedTime}
              </div>

              {!showFull && isOverflowed && (
                <button
                  onClick={() => setShowFull(true)}
                  className={`text-xs mt-1 underline ${
                    isMine ? 'text-white' : 'text-gray-600'
                  } self-end`}
                >
                  전체보기
                </button>
              )}
            </>
          )}

          {/* ✅ 메시지 메뉴 */}
          {showMenu && (
            <div
              className={`absolute top-full mt-2 z-10 bg-white border rounded shadow text-xs w-[100px] ${
                isMine ? 'right-0' : 'left-0'
              }`}
            >
              <button
                className="px-3 py-2 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  navigator.clipboard.writeText(message.message);
                  onToggleMenu();
                }}
              >
                복사하기
              </button>
              <button
                className="px-3 py-2 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  onReply?.(message);
                  onToggleMenu();
                }}
              >
                답장하기
              </button>
              {isMine && (
                <button
                  className="px-3 py-2 text-red-500 hover:bg-red-100 w-full text-left"
                  onClick={() => {
                    onDelete?.();
                    onToggleMenu();
                  }}
                >
                  삭제하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

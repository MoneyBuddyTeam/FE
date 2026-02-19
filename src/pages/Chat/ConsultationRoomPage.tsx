import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../../components/pages/Chat/ChatBox';
import ChatInput from '../../components/pages/Chat/ChatInput';
import ChatHeader from '../../components/pages/Chat/ChatHeader';
import ChatNotice from '../../components/pages/Chat/ChatNotice';
import { connectStomp, disconnectStomp } from '../../utils/stompClient';
import { useChatStore } from '../../stores/useChatStore';
import type { ConsultationMessage } from '../../types';
import ChatSearchBar from '../../components/pages/Chat/ChatSearchBar';
import { sendChatMessage } from '../../services/chat/sendChatMessage';

// (선택) 이미지 업로드 API 함수
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/v1/uploads', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.url; // 백엔드 응답에 맞게 조정
}

export default function ConsultationRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const numericRoomId = Number(roomId);
  const senderId = Number(localStorage.getItem('userId'));
  const senderNickname = localStorage.getItem('nickname') || '알 수 없음';

  const { showSearchInput, addMessage, replyTarget, setReplyTarget } =
    useChatStore();

  useEffect(() => {
    if (!roomId) return;

    connectStomp({
      roomId: numericRoomId,
      token: '',
      onMessage: (msg: ConsultationMessage) => {
        addMessage(msg);
      },
    });

    return () => disconnectStomp();
  }, [roomId, addMessage]);

  const handleSend = async (text: string, imageFile?: File) => {
    if (!roomId) return;

    const baseMessage = {
      consultationRoomId: numericRoomId,
      senderId,
      senderNickname,
      sentAt: new Date().toISOString(),
      replyTo: replyTarget?.messageId ?? null,
    };

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      sendChatMessage({
        ...baseMessage,
        type: 'IMAGE',
        message: text,
        imageUrl,
      });
    } else {
      sendChatMessage({
        ...baseMessage,
        type: 'TEXT',
        message: text,
      });
    }

    setReplyTarget(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <ChatHeader />
      {showSearchInput && <ChatSearchBar />}
      <ChatNotice />
      <div className="flex-1 overflow-y-auto">
        {roomId && <ChatBox roomId={numericRoomId} myId={senderId} />}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}

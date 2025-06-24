// WebSocket 연결 및 수신 처리
import { Stomp, CompatClient, type IMessage } from '@stomp/stompjs';
import type { ChatMessage } from '../../types';
import { parseMessageFrame } from './chatUtils';

export let stompClient: CompatClient | null = null;

export const connectChatSocket = ({
  roomId,
  onMessage,
  onConnectChange,
}: {
  roomId: number;
  onMessage: (msg: ChatMessage) => void;
  onConnectChange: (
    status: 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING',
  ) => void;
}) => {
  const client = Stomp.over(
    () => new WebSocket('ws://localhost:8080/ws-stomp'),
  );
  stompClient = client;

  client.connect(
    {},
    () => {
      onConnectChange('CONNECTED');
      client.subscribe(`/sub/chat/room/${roomId}`, (frame: IMessage) => {
        const msg = parseMessageFrame(frame);
        onMessage(msg);
      });
    },
    (error: any) => {
      console.error('❌ STOMP 연결 실패:', error);
      onConnectChange('DISCONNECTED');
    },
  );

  return () => {
    client.disconnect(() => {
      onConnectChange('DISCONNECTED');
    });
  };
};

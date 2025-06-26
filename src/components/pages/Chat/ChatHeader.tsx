import { ChevronLeft, MoreVertical, Search } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeaveChatModal from '../../modals/LeaveChatModal';
import ReportExpertModal from '../../modals/ReportExpertModal';
import ReportCompleteModal from '../../modals/ReportCompleteModal';
import Button from '../../common/Button';
import { useChatStore } from '../../../stores/useChatStore';
import { cancelConsultation } from '../../../services';
import { axiosInstance } from '../../../services/api';
import { API_ENDPOINTS } from '../../../config/api';
import { getChatRoomDetailApi } from '../../../services/chat/chatApi';

export default function ChatHeader() {
  const { roomId } = useParams<{ roomId: string }>();
  const numericRoomId = Number(roomId);
  const navigation = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportCompleteModal, setShowReportCompleteModal] = useState(false);

  const { showSearchInput, setShowSearchInput } = useChatStore();

  const menuRef = useRef<HTMLDivElement>(null);

  const [expertName, setExpertName] = useState('전문가');
  const [expertImage, setExpertImage] = useState('');

  useEffect(() => {
    if (!numericRoomId) return;

    const fetchExpertInfo = async () => {
      try {
        const roomData = await getChatRoomDetailApi(numericRoomId);
        const advisorId = roomData.advisorId;

        const advisorRes = await axiosInstance.get(
          API_ENDPOINTS.advisorDetail(advisorId),
        );

        console.log('🔍 전체 응답', advisorRes.data);

        const name = advisorRes.data.name ?? advisorRes.data.nickname;
        setExpertName(name ? `${name} 전문가` : '전문가');
        setExpertImage(advisorRes.data.profileImageUrl || '');
      } catch (error) {
        console.error('❌ 전문가 정보 불러오기 실패:', error);
        setExpertName('이름 없는 전문가');
      }
    };

    fetchExpertInfo();
  }, [numericRoomId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center p-4 border-b relative">
      <div className="flex items-center gap-3">
        <button onClick={() => navigation(-1)}>
          <ChevronLeft size={24} />
        </button>

        {expertImage && (
          <img
            src={expertImage}
            alt="전문가 프로필"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}

        <div className="text-lg font-semibold">{expertName}</div>
      </div>

      <div className="relative flex items-center gap-2">
        <Search
          size={20}
          className="cursor-pointer"
          onClick={() => setShowSearchInput(!showSearchInput)}
        />
        <button onClick={() => setShowMenu(prev => !prev)}>
          <MoreVertical size={20} />
        </button>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-36 bg-white border rounded-lg shadow-lg z-10"
          >
            <Button
              variant="text2"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-b2 font-bold"
              onClick={() => {
                setShowMenu(false);
                setShowLeaveModal(true);
              }}
            >
              채팅방 나가기
            </Button>
            <Button
              variant="text2"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-b2 font-bold"
              onClick={() => {
                setShowMenu(false);
                setShowReportModal(true);
              }}
            >
              엑스퍼트 신고하기
            </Button>
          </div>
        )}

        {showLeaveModal && (
          <LeaveChatModal
            onClose={() => setShowLeaveModal(false)}
            onConfirm={async () => {
              try {
                await cancelConsultation(numericRoomId);
                setShowLeaveModal(false);
                navigation('/');
              } catch (err) {
                console.error('채팅방 나가기 실패', err);
                alert('채팅방을 나가는 데 실패했습니다.');
              }
            }}
          />
        )}

        {showReportModal && (
          <ReportExpertModal
            onClose={() => setShowReportModal(false)}
            onSubmit={selectedReasons => {
              console.log('신고 사유:', selectedReasons);
              setShowReportModal(false);
              setShowReportCompleteModal(true);
            }}
          />
        )}

        {showReportCompleteModal && (
          <ReportCompleteModal
            onClose={() => setShowReportCompleteModal(false)}
            onConfirm={() => {
              setShowReportCompleteModal(false);
              navigation('/');
            }}
          />
        )}
      </div>
    </div>
  );
}

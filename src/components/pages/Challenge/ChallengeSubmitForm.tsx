import { useState } from 'react';
import ChallengeHeader from './ChallengeHeader';
import Button from '../../common/Button';
import UploadMission from './UploadMission';
import { useNavigate } from 'react-router-dom';
import {
  uploadMissionProof,
  markMissionAsDone,
} from '../../../services/challenge/challengeApi';

interface ChallengeSubmitFormProps {
  checklistTitle?: string;
  challengeId?: string;
  missionId?: number;
}

export default function ChallengeSubmitForm({
  checklistTitle,
  challengeId,
  missionId,
}: ChallengeSubmitFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (images.length + videos.length === 0 || !challengeId || !missionId)
      return;

    try {
      const allFiles = [...images, ...videos];
      await Promise.all(
        allFiles.map(file => uploadMissionProof(missionId, file)),
      );
      await markMissionAsDone(missionId);
      navigate(`/challenge/${challengeId}/submit-success`, { replace: true });
    } catch (e) {
      alert('제출에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div>
      <ChallengeHeader checklistTitle={checklistTitle} />
      <div className="p-5">
        <div className="mb-6">
          <p className="text-h3 mb-2">
            챌린지 인증 첨부{' '}
            <span className="text-[#FF7497] text-b3">* 필수</span>
          </p>
        </div>
        <UploadMission
          type="image"
          files={images}
          max={7}
          onChange={setImages}
          onRemove={index => setImages(images.filter((_, i) => i !== index))}
        />
        <UploadMission
          type="video"
          files={videos}
          max={3}
          onChange={setVideos}
          onRemove={index => setVideos(videos.filter((_, i) => i !== index))}
        />
        <div className="mb-6">
          <label className="text-sm font-semibold block mb-1">
            추가로 전하고 싶은 내용
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="엑스퍼트님께 추가로 전하고 싶은 내용이 있다면 여기에 적어보세요."
            className="w-full p-2 border border-gray-300 rounded"
            maxLength={500}
            rows={4}
          />
          <p className="text-xs text-right text-gray-400 mt-1">
            {description.length}/500자
          </p>
        </div>
        <Button
          variant={images.length + videos.length > 0 ? 'primary' : 'disabled'}
          disabled={images.length + videos.length === 0}
          onClick={handleSubmit}
        >
          제출하기
        </Button>
      </div>
    </div>
  );
}

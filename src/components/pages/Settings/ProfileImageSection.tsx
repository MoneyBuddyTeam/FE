import { Edit } from 'lucide-react';
import { settingsStyles } from '../../../styles/settings.styles';

interface ProfileImageSectionProps {
  profileImage?: string;
  onImageChange: () => void;
}

export default function ProfileImageSection({
  onImageChange,
}: ProfileImageSectionProps) {
  return (
    <div className={settingsStyles.profileImageContainer}>
      <img
        src={'/jpg/experts/profile.png'}
        alt="프로필 이미지"
        className={settingsStyles.profileImage}
      />
      <button
        onClick={onImageChange}
        className={settingsStyles.editButton}
        aria-label="프로필 이미지 변경"
      >
        <Edit size={12} className="text-[#111111]" />
      </button>
    </div>
  );
}

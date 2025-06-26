interface ChallengeHeaderProps {
  checklistTitle?: string;
}

export default function ChallengeHeader({
  checklistTitle,
}: ChallengeHeaderProps) {
  return (
    <div>
      <div className="bg-[#F5F5F5] text-b2 text-center py-3 text-[#9C9C9C] mb-4">
        사진 또는 영상(50mb이내)을 반드시 1장 이상 첨부해주세요.
      </div>
      <div className="flex flex-col justify-center items-center my-2">
        <div className="text-h3 mb-1">
          {checklistTitle ?? '체크리스트 제목'}
        </div>
        <p className="text-b3 text-[#777777] mb-4">
          챌린지를 완수했나요? 지금 제출해보아요!
        </p>
      </div>
    </div>
  );
}

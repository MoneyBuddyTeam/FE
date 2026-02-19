import piggy from '../../../assets/images/piggy.png';

interface QuizModalProps {
  correct: boolean;
  onClose: () => void;
}

export default function QuizModal({ correct, onClose }: QuizModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[300px] rounded-xl p-6 text-center">
        {correct ? (
          <>
            <img src={piggy} alt="정답 아이콘" className="mx-auto w-20 mb-4" />
            <p className="text-lg font-semibold mb-1">
              정확히 맞추셨습니다! 멋져요! 💪
            </p>
            <p className="text-[#6488FF] font-semibold mb-4">
              +10 포인트 적립 🎉
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-medium text-[#333] mb-2">
              아쉬워요! <br />
              정답은{' '}
              <span className="text-[#6488FF] font-bold">국내총생산</span>
              입니다.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              다음 문제에서는 정답을 맞춰보아요! 🌟
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-[#6488FF] text-white rounded-md font-semibold"
        >
          확인
        </button>
      </div>
    </div>
  );
}

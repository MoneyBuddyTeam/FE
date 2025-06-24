// C:\project\FE\src\components\pages\ExpertDetail\components\tabs\LectureTab.tsx

export default function LectureTab() {
  return (
    <div className="bg-gray-100 pt-6 px-5">
      <h3 className="font-semibold text-lg mb-4 pl-1">강의</h3>
      <div className="space-y-3 mb-6">
        {[1, 2, 3].map(item => (
          <div key={item} className="bg-white rounded-lg shadow-sm p-3 flex">
            <div className="w-14 h-14 rounded bg-gray-200 mr-2"></div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">청년을 위한 금융 첫걸음</h4>
              <p className="text-xs text-gray-500">
                예금, 적금부터 시작하는 초보자를 위한 금융 기초 강의
              </p>
              <div className="flex text-gray-400 text-[10px] mt-1 gap-1">
                <span>약 5분 소요</span>
                <span>•</span>
                <span>1K 보는 중</span>
                <span>•</span>
                <span>26명이 추천했어요!</span>
              </div>
            </div>
          </div>
        ))}
        <button className="w-full border border-gray-200 rounded py-4 text-sm font-semibold">
          더보기
        </button>
      </div>
    </div>
  );
}

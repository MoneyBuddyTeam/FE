// C:\project\FE\src\components\pages\ExpertDetail\components\tabs\MagazineTab.tsx

export default function MagazineTab() {
  return (
    <div className="bg-gray-100 pt-6 px-5">
      <h3 className="font-semibold text-lg mb-4 pl-1">매거진</h3>
      <div className="bg-white rounded-lg p-3 mb-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h4 className="font-normal text-sm mb-2">
            인기글이랑 매거진을 찢는게 나을지 붙이는게 나을지
          </h4>
          <div className="text-xs text-gray-500">좋아요 100 · 댓글 11</div>
        </div>
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h4 className="font-normal text-sm mb-2">
            적금 처음에 뭐부터 드는게 좋을까요?
          </h4>
          <div className="text-xs text-gray-500">좋아요 100 · 댓글 11</div>
        </div>
        <div className="mb-4">
          <h4 className="font-normal text-sm mb-2">
            투자 처음 시작하는 주린이 입니다.
          </h4>
          <div className="text-xs text-gray-500">좋아요 100 · 댓글 11</div>
        </div>
        <button className="w-full border border-gray-200 rounded py-4 text-sm font-semibold">
          더보기
        </button>
      </div>
    </div>
  );
}

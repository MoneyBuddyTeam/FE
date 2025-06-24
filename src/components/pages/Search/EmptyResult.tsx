import Empty from '../../../assets/images/coin.png';
export default function EmptyResult() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <img src={Empty} alt="검색 결과 없음" className="w-24 h-24 mb-4" />
      <p className="text-sm text-gray-600">검색 결과가 없어요,</p>
      <p className="text-sm text-gray-600">다시 검색해주세요.</p>
    </div>
  );
}

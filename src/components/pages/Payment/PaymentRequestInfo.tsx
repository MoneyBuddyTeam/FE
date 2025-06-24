interface PaymentRequestInfoProps {
  request: string;
  setRequest: (request: string) => void;
}

export default function PaymentRequestInfo({
  request,
  setRequest,
}: PaymentRequestInfoProps) {
  return (
    <div className="flex flex-col items-start py-[24px] gap-[14px] w-[390px]">
      <h2 className="w-[350px] h-[20px] font-semibold text-[16px] leading-[20px] tracking-[-0.025em] text-[#111111]">
        요청사항
      </h2>

      <div className="box-border flex flex-col items-start p-[13px_14px] gap-[10px] w-[350px] bg-white border border-[#F1F1F1] rounded-[8px]">
        <input
          type="text"
          value={request}
          onChange={e => setRequest(e.target.value)}
          placeholder="예) 어떤 곳에 투자를 하는게 좋을까요?"
          className="w-full h-[17px] font-normal text-[12px] leading-[140%] tracking-[-0.025em] text-[#777777] outline-none border-none"
        />
      </div>
    </div>
  );
}

interface ContactStatusChipProps {
  isContactAvailable: boolean;
}

export default function ContactStatusChip({ isContactAvailable }: ContactStatusChipProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg px-[6px] py-[2px] text-sm font-500 ${isContactAvailable ? `bg-blue-50 text-blue-500` : `bg-yellow-50 text-yellow-500`}`}
    >
      {isContactAvailable ? "바로 연결" : "연결 느림"}
    </div>
  );
}

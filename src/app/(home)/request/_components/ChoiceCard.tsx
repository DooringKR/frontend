"use client";

/**
 * 고르기 카드 — 구 바로가구 받는 방법 카드(ReceiveOptionCard)와 같은 모양에 고름·못 고름 상태만 더했다.
 * emphasized = 화면 1 「현장 급한 수습」처럼 눈에 띄게 둘 것.
 */
export default function ChoiceCard({
  title,
  description,
  checked = false,
  disabled = false,
  emphasized = false,
  onClick,
}: {
  title: string;
  description?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  emphasized?: boolean;
  onClick: () => void;
}) {
  const tone = disabled
    ? "border-gray-100 bg-gray-50 text-gray-300"
    : checked
      ? "border-brand-500 bg-brand-50"
      : emphasized
        ? "border-red-200 bg-red-50"
        : "border-gray-200 bg-white";
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={checked}
      onClick={onClick}
      className={`flex w-full flex-col items-start gap-1 rounded-xl border px-5 py-4 text-left transition-colors ${tone}`}
    >
      <span className={`text-[17px] font-600 ${disabled ? "" : emphasized && !checked ? "text-red-600" : "text-gray-800"}`}>
        {title}
      </span>
      {description && <span className={`text-[14px] font-400 ${disabled ? "" : "text-gray-500"}`}>{description}</span>}
    </button>
  );
}

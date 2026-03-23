import { PriceTraceStep } from "@/services/pricing/priceTrace";

type PriceDebugPanelProps = {
  steps: PriceTraceStep[];
  className?: string;
};

export default function PriceDebugPanel({ steps, className = "" }: PriceDebugPanelProps) {
  return (
    <div className={`rounded-[12px] border border-orange-200 bg-orange-50 px-4 py-3 ${className}`}>
      <div className="mb-2 text-[11px] font-700 text-orange-600">[ DEBUG ] 가격 계산 과정</div>
      <div className="space-y-1">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-start justify-between gap-4 text-[12px] ${
              step.isFinal
                ? "mt-2 border-t border-orange-200 pt-2 font-700 text-orange-800"
                : "text-gray-700"
            }`}
          >
            <span className="shrink-0 text-gray-500">{step.label}</span>
            <span className={step.isFinal ? "text-orange-700" : "font-500 text-right"}>{step.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

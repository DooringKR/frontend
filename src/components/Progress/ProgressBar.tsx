import { Progress } from "@/components/ui/progress";

export type ProgressValue = 0 | 20 | 40 | 60 | 80 | 100;

/**
 * 단계 진행 막대 — 위 바(TopNavigator) 바로 밑에 붙는다. 막대는 shadcn Progress.
 */
export default function ProgressBar({ progress, className = "" }: { progress: ProgressValue; className?: string }) {
  return (
    <div className={`fixed top-[60px] z-40 flex w-full max-w-[460px] items-center bg-white px-5 ${className}`}>
      <Progress value={progress} aria-label="진행" className="flex-1" />
      <span className="w-12 pl-2 text-right text-[14px]/5 font-500 text-blue-600">{progress}%</span>
    </div>
  );
}

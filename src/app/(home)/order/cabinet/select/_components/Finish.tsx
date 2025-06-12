"use client";

import Button from "@/components/BeforeEditByKi/Button/Button";

interface FinishTypeProps {
  finishType: string | null;
  setFinishType: (value: "urahome" | "makura" | null) => void;
}

function Finish({ setFinishType, finishType }: FinishTypeProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm text-gray-300">마감 방식</h3>
      <div className="flex w-full flex-grow gap-4">
        <Button
          onClick={() => setFinishType("makura")}
          selected={finishType === "makura"}
          className="w-full"
        >
          막우라
        </Button>
        <Button
          onClick={() => setFinishType("urahome")}
          selected={finishType === "urahome"}
          className="w-full"
        >
          우라홈
        </Button>
      </div>
    </div>
  );
}

export default Finish;

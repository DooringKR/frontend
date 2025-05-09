"use client";

import Button from "@/components/Button/Button";

interface FinishTypeProps {
  finishType: string | null;
  setFinishType: (value:"urahome" | "makura" | null) => void;
}

function Finish({ setFinishType, finishType }: FinishTypeProps) {
  return (
    <div>
      <h3 className="mb-2">마감 방식</h3>
      <div className="flex flex-grow gap-4 w-full">
        <Button
          onClick={() => setFinishType("makura")}
          className={`w-full border border-black ${
            finishType === "makura" ? "bg-black text-white" : "bg-gray-200 text-black"
          }`}
        >
          막우라
        </Button>
        <Button
          onClick={() => setFinishType("urahome")}
          className={`w-full border border-black ${
            finishType === "urahome" ? "bg-black text-white" : "bg-gray-200 text-black"
          }`}
        >
          우라홈
        </Button>
      </div>
    </div>
  );
}

export default Finish;

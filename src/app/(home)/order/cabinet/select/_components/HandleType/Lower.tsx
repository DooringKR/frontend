"use client";

import Button from "@/components/BeforeEditByKi/Button/Button";

interface UpperProps {
  handleType: "channel" | "outer" | "pull-down" | null;
  setHandleType: (value: "channel" | "outer" | "pull-down" | null) => void;
}

function Lower({ setHandleType, handleType }: UpperProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm text-gray-300">손잡이 종류</h3>
      <div className="flex w-full flex-grow gap-4">
        <Button
          onClick={() => setHandleType("channel")}
          selected={handleType === "channel"}
          className="w-full"
        >
          찬넬
        </Button>

        <Button
          onClick={() => setHandleType("outer")}
          selected={handleType === "outer"}
          className="w-full"
        >
          겉손잡이
        </Button>
      </div>
    </div>
  );
}

export default Lower;

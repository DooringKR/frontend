"use client";

import Button from "@/components/Button/Button";

interface UpperProps {
  handleType: "channel" | "outer" | "pull-down" | null;
  setHandleType: (value: "channel" | "outer" | "pull-down" | null) => void;
}

function Upper({ setHandleType, handleType }: UpperProps) {
  return (
    <div>
      <h3 className="mb-2">손잡이 종류</h3>
      <div className="flex w-full flex-grow gap-4">
        <Button
          onClick={() => setHandleType("outer")}
          selected={handleType === "outer"}
          className="w-full"
        >
          겉손잡이
        </Button>
        <Button
          onClick={() => setHandleType("pull-down")}
          selected={handleType === "pull-down"}
          className="w-full"
        >
          내리기
        </Button>
      </div>
    </div>
  );
}

export default Upper;

"use client";

import Button from "@/components/Button/Button";

interface UpperProps {
  handleType: "channel" | "outer" | "pull-down"| null;
  setHandleType: (value: "channel" | "outer" | "pull-down"| null) => void;
}

function Lower({ setHandleType, handleType }: UpperProps) {
  return (
    <div>
      <h3 className="mb-2">손잡이 종류</h3>
      <div className="flex flex-grow gap-4 w-full">
        <Button
          onClick={() => setHandleType("channel")}
          className={`w-full border border-black ${
            handleType === "channel" ? "bg-black text-white" : "bg-gray-200 text-black"
          }`}
        >
          찬넬
        </Button>
        <Button
          onClick={() => setHandleType("outer")}
          className={`w-full border border-black ${
            handleType === "outer" ? "bg-black text-white" : "bg-gray-200 text-black"
          }`}
        >
          겉손잡이 
        </Button>
      </div>
    </div>
  );
}

export default Lower;
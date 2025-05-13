"use client";

import Button from "@/components/Button/Button";

interface UpperProps {
  handleType: "channel" | "outer" | "pull-down"| null;
  setHandleType: (value: "channel" | "outer" | "pull-down"| null) => void;
}

function Upper({ setHandleType, handleType }: UpperProps) {
  return (
    <div>
      <h3 className="mb-2">손잡이 종류</h3>
      <div className="flex flex-grow gap-4 w-full">
        <Button
          onClick={() => setHandleType("outer")}
          className={`w-full border border-black ${
            handleType === "outer" ? "bg-black text-white" : "bg-gray-200 text-black"
          }`}
        >
          겉손잡이
        </Button>
        <Button
          onClick={() => setHandleType("pull-down")}
          className={`w-full border border-black ${
            handleType === "pull-down" ? "bg-black text-white" : "bg-gray-200 text-black"
          }`}
        >
          내리기 
        </Button>
      </div>
    </div>
  );
}

export default Upper;
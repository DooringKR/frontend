"use client";

import Button from "@/components/Button/Button";

import useUserStore from "@/store/userStore";

export default function LoginStep1Page() {
  const { userType, user_phoneNumber, setUserType, setUserPhoneNumber } = useUserStore();

  const handleTypeSelect = (type: "company" | "factory") => {
    setUserType(type);
  };
  return (
    <div className="relative flex h-screen w-full flex-col gap-5 bg-white p-5">
      <h1 className="text-2xl font-semibold leading-[1.2] text-[#000000]">
        반가워요, <br /> 어떤 업체이신가요?
      </h1>
      <div className="flex flex-col gap-3">
        <p className="text-base text-neutral-700">업체 유형</p>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => handleTypeSelect("company")}
            className={`h-10 flex-1 rounded-md border transition ${
              userType === "company"
                ? "bg-black text-white"
                : "border-[#767676] bg-[#e3e3e3] text-black"
            }`}
          >
            인테리어 업체
          </Button>
          <Button
            type="button"
            onClick={() => handleTypeSelect("factory")}
            className={`h-10 flex-1 rounded-md border transition ${
              userType === "factory"
                ? "bg-black text-white"
                : "border-[#767676] bg-[#e3e3e3] text-neutral-700"
            }`}
          >
            공장
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
          <label className="text-base font-medium text-neutral-800">휴대폰 번호</label>
          <input
            type="text"
            value={user_phoneNumber || ""}
            onChange={e => setUserPhoneNumber(e.target.value)}
            placeholder="010-1234-5678"
            className="h-12 w-full rounded-md border border-neutral-300 px-4 text-black"
          />
        </div>
    </div>
  );
}

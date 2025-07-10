"use client";

export default function PickUpAddressCard() {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText("경기도 남양주시 오남읍 양지로139번길 11-14");
    alert("주소가 복사되었습니다!");
  };

  return (
    <div className="flex justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
      <div className="flex gap-3">
        <img src={"/icons/map.svg"} alt="지도 아이콘" />
        <div>
          <h1 className="text-[17px] font-600">픽업주소</h1>
          <h2 className="text-[15px] font-400">
            경기도 남양주시 오남읍 양지로
            <br />
            139번길 11-14
          </h2>
        </div>
      </div>
      <button
        onClick={handleCopyAddress}
        type="button"
        className="bg-gray-100 px-[10px] py-[5px] text-[15px] font-500"
      >
        복사
      </button>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { useOrderStore } from "@/store/orderStore";

// interface Props {
//   requestMessage: string;
//   setRequestMessage: (message: string) => void;
//   foyerAccessType: {
//     type: "gate" | "call" | "doorfront" | "custom";
//     gatePassword: string | null;
//     customRequest: string | null;
//   };
//   setFoyerAccessType: (data: {
//     type: "gate" | "call" | "doorfront" | "custom";
//     gatePassword: string | null;
//     customRequest: string | null;
//   }) => void;
// }

export default function DeliveryRequestSelector() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [tempPassword, setTempPassword] = useState(foyerAccessType.gatePassword || "");
  // const [tempCustomRequest, setTempCustomRequest] = useState(foyerAccessType.gatePassword || "");

  const router = useRouter();
  const requestMessage = useOrderStore(state => state.requestMessage);
  const foyerAccessType = useOrderStore(state => state.foyerAccessType);

  // const handleSelect = (type: "gate" | "call" | "doorfront" | "custom") => {
  //   setFoyerAccessType({
  //     type,
  //     gatePassword: type === "gate" ? tempPassword : null,
  //     customRequest: type === "custom" ? tempCustomRequest : null,
  //   });
  // };

  // const handleSave = () => {
  //   if (foyerAccessType.type === "gate") {
  //     setFoyerAccessType({ type: "gate", gatePassword: tempPassword, customRequest: null });
  //     setRequestMessage("공동현관으로 올라오세요");
  //   } else if (foyerAccessType.type === "custom") {
  //     setFoyerAccessType({ type: "custom", gatePassword: null, customRequest: tempCustomRequest });
  //     setRequestMessage("직접 입력");
  //   } else if (foyerAccessType.type === "call") {
  //     setRequestMessage("전화주시면 마중 나갈게요");
  //   } else {
  //     setRequestMessage("문 앞에 두면 가져갈게요");
  //   }
  //   setIsModalOpen(false);
  // };

  // useEffect(() => {
  //   setTempPassword(foyerAccessType.gatePassword || "");
  //   setTempCustomRequest(foyerAccessType.customRequest || "");
  // }, [foyerAccessType]);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4">
        <div className="flex flex-col gap-2">
          <p className="text-[17px] font-600">배송 시 요청사항</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => router.push("/cart/checkorder/delivery-request")}
              className="text-left text-[15px] font-500 text-gray-800"
            >
              {requestMessage || "선택해주세요"}
            </button>
            {foyerAccessType.type === "gate" && foyerAccessType.gatePassword?.trim() && (
              <span className="text-[15px] text-gray-800">{foyerAccessType.gatePassword}</span>
            )}
            {foyerAccessType.type === "custom" && foyerAccessType.customRequest?.trim() && (
              <span className="text-[15px] text-gray-800">{foyerAccessType.customRequest}</span>
            )}
          </div>
        </div>
        <button
          className="flex gap-1"
          onClick={() => router.push("/cart/checkorder/delivery-request")}
        >
          <span className="text-[15px] font-500 text-blue-500">요청 선택</span>
          <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
        </button>
      </div>
    </>
  );
}

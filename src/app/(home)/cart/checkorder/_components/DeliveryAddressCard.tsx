"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import AddressModal from "./AddressModal";

interface DeliveryAddressCardProps {
  address: { address1: string; address2: string };
  requestMessage: string;
  setRequestMessage: (message: string) => void;
  setAddress: (address: { address1: string; address2: string }) => void;
  foyerAccessType: {
    type: "gate" | "call" | "doorfront";
    gatePassword: string | null;
  };
  setFoyerAccessType: (data: {
    type: "gate" | "call" | "doorfront";
    gatePassword: string | null;
  }) => void;
}

export default function DeliveryAddressCard({
  address,
  requestMessage,
  foyerAccessType,
  setFoyerAccessType,
  setRequestMessage,
  setAddress,
}: DeliveryAddressCardProps) {
  const router = useRouter();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleAddressSelect = (addr1: string, addr2: string) => {
    setAddress({ address1: addr1, address2: addr2 });
  };

  return (
    <div className="rounded-xl border border-gray-200 px-5 py-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-600">배송주소</p>
            <p className="text-[15px] font-500">{address.address1}</p>
            <p className="text-[15px] font-400">{address.address2}</p>
          </div>
          <button onClick={() => setIsAddressModalOpen(true)}>
            <img src={"/icons/chevron-right.svg"} alt="오른쪽 화살표" />
          </button>
        </div>
        {isAddressModalOpen && (
          <AddressModal
            onClose={() => setIsAddressModalOpen(false)}
            onAddressSelect={handleAddressSelect}
          />
        )}
      </div>
    </div>
  );
}

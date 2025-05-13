import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import CategorySection from "./_components/CategorySection";
import DeliveryTimer from "./_components/DeliveryTimer";

async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  const user = null;

  return (
    <div className="mx-5 flex flex-col gap-4 py-5">
      <div className="flex items-center">
        <div>
          <h1 className="text-lg font-bold">
            {user ? "돌아오신 것을 환영해요!" : "믿고 주문하는"}
          </h1>
          <p className="text-base font-semibold">바로가구 A/S 자재 배송</p>
        </div>
      </div>
      <DeliveryTimer user={user} />
      <CategorySection />
    </div>
  );
}

export default Page;

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AddressIndicator from "@/components/AddressIndicator/AddressIndicator";
import HomeProductContainer from "@/components/HomeProductContaines/HomeProductContainer";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import Footer from "./_components/Footer";

async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  const user = null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col px-5">
        <TopNavigator page="/" isCartEmpty={true} />

        <div className="h-[125px] w-full">
          <img src="/img/banner.png" alt="배너 이미지" className="h-full w-full object-cover" />
        </div>

        <div className="mb-7 mt-10 border-2 border-green-600">서울 성북구 지봉로24길</div>
        <AddressIndicator deliverySchedule="" />
        <HomeProductContainer />
      </main>

      <Footer />
    </div>
  );
}

export default Page;

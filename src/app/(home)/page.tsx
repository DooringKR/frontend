import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AddressIndicator from "@/components/AddressIndicator/AddressIndicator";
import Banner from "@/components/Banner/Banner";
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
      <TopNavigator page="/" isCartEmpty={true} />
      <Banner />

      <main className="mt-10 flex flex-col gap-7">
        <AddressIndicator deliverySchedule="" />
        <HomeProductContainer />
      </main>

      <Footer />
    </div>
  );
}

export default Page;

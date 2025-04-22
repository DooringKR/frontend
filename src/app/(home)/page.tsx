import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DeliveryTimer from "./_components/DeliveryTimer";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div>
      <DeliveryTimer />
    </div>
  );
}

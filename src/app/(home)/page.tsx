import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Card from "@/components/Card/Card";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <div>
    </div>
  );
}

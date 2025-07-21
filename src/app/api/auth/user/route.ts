// import { NextRequest, NextResponse } from "next/server";

// export async function GET(userId: number) {
//   console.log("111");
//   const res = await fetch(`https://dooring-backend.onrender.com/app_user/${userId}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   const data = await res.json();

//   return NextResponse.json(data);
// }

// export async function PUT(request: NextRequest) {
//   const body = await request.json();
//   //미완
//   const res = await fetch(`https://dooring-backend.onrender.com/auth/user`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   const data = await res.json();

//   return NextResponse.json(data);
// }

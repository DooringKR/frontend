import { Request, Response } from "express";
import prisma from "../prismaClient";

// 회원가입
export async function signup(req: Request, res: Response) {
  const { user_phone, user_type } = req.body;

  // 1) 필수 필드 검증
  if (
    typeof user_phone !== "string" ||
    !/^[0-9]{11}$/.test(user_phone)
  ) {
    return res
      .status(400)
      .json({ message: "user_phone은 11자리 숫자여야 합니다." });
  }
  if (!["INTERIOR", "FACTORY"].includes(user_type)) {
    return res
      .status(400)
      .json({ message: "user_type은 INTERIOR 또는 FACTORY여야 합니다." });
  }

  // 2) 중복검사
  const exists = await prisma.user.findUnique({
    where: { user_phone },
  });
  if (exists) {
    return res
      .status(409)
      .json({ message: "이미 가입된 회원입니다" });
  }

  // 3) 신규 생성
  await prisma.user.create({
    data: { user_phone, user_type },
  });
  return res
    .status(201)
    .json({ message: "가입이 성공했습니다" });
}

// 중복검증 (HEAD)
export async function checkDuplicate(req: Request, res: Response) {
  const phone = String(req.query.user_phone || "");
  // 1) 쿼리가 없거나 포맷 오류 시 400
  if (!/^[0-9]{11}$/.test(phone)) {
    return res.status(400).end();
  }
  // 2) 존재 여부에 따라 409 또는 200
  const exists = await prisma.user.findUnique({
    where: { user_phone: phone },
  });
  return exists ? res.status(409).end() : res.status(200).end();
}

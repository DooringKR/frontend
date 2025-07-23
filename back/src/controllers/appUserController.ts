import { Request, Response } from "express";
import prisma from "../prismaClient";

// GET /app_user/:user_id — 유저 정보 조회
export async function getUserInfo(req: Request, res: Response) {
  const userId = Number(req.params.user_id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "user_id는 정수여야 합니다" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      user_phone: true,
      user_type: true,
      user_road_address: true,
      user_detail_address: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "해당 사용자를 찾을 수 없습니다" });
  }

  return res.status(200).json(user);
}

// PUT /app_user/:user_id — 유저 주소 수정
export async function updateUserAddress(req: Request, res: Response) {
  const userId = Number(req.params.user_id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "user_id는 정수여야 합니다" });
  }

  const { user_road_address, user_detail_address } = req.body;
  if (
    typeof user_road_address !== "string" ||
    typeof user_detail_address !== "string"
  ) {
    return res.status(400).json({ message: "주소 형식이 올바르지 않습니다" });
  }

  const exists = await prisma.user.findUnique({ where: { id: userId } });
  if (!exists) {
    return res.status(404).json({ message: "해당 사용자를 찾을 수 없습니다" });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { user_road_address, user_detail_address },
  });

  return res.status(200).json({
    user_phone: updated.user_phone,
    user_type: updated.user_type,
    user_road_address: updated.user_road_address,
    user_detail_address: updated.user_detail_address,
  });
}
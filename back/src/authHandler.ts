// src/authHandler.ts
import { Request, Response } from 'express';
import prisma from './prismaClient';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export const handleSignIn = async (req: Request, res: Response): Promise<Response> => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: '전화번호가 필요합니다.' });
  }

  const user = await prisma.user.findUnique({ where: { phoneNumber } });

  if (user) {
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.setHeader(
      'Set-Cookie',
      serialize('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
    );

    return res.status(200).json({ isRegistered: true, accessToken });
  } else {
    return res.status(200).json({ isRegistered: false });
  }
};

export const handleSignUp = async (req: Request, res: Response): Promise<Response> => {
  const { userType, phoneNumber } = req.body;

  if (!userType || !phoneNumber) {
    return res.status(400).json({ message: 'userType과 phoneNumber가 필요합니다.' });
  }

  const existingUser = await prisma.user.findUnique({ where: { phoneNumber } });

  if (existingUser) {
    return res.status(400).json({ message: '이미 가입된 사용자입니다.' });
  }

  const newUser = await prisma.user.create({ data: { userType, phoneNumber } });

  const accessToken = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

  res.setHeader(
    'Set-Cookie',
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
  );

  return res.status(201).json({ accessToken });
};

export const handleUserInfo = async (req: Request, res: Response): Promise<Response> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: '토큰이 필요합니다.' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

    return res.status(200).json({ id: user.id, userType: user.userType, phoneNumber: user.phoneNumber });
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

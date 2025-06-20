"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserInfo = exports.handleSignUp = exports.handleSignIn = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = require("cookie");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
const handleSignIn = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: '전화번호가 필요합니다.' });
    }
    const user = await prismaClient_1.default.user.findUnique({ where: { phoneNumber } });
    if (user) {
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.setHeader('Set-Cookie', (0, cookie_1.serialize)('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        }));
        return res.status(200).json({ isRegistered: true, accessToken });
    }
    else {
        return res.status(200).json({ isRegistered: false });
    }
};
exports.handleSignIn = handleSignIn;
const handleSignUp = async (req, res) => {
    const { userType, phoneNumber } = req.body;
    if (!userType || !phoneNumber) {
        return res.status(400).json({ message: 'userType과 phoneNumber가 필요합니다.' });
    }
    const existingUser = await prismaClient_1.default.user.findUnique({ where: { phoneNumber } });
    if (existingUser) {
        return res.status(400).json({ message: '이미 가입된 사용자입니다.' });
    }
    const newUser = await prismaClient_1.default.user.create({ data: { userType, phoneNumber } });
    const accessToken = jsonwebtoken_1.default.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.setHeader('Set-Cookie', (0, cookie_1.serialize)('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    }));
    return res.status(201).json({ accessToken });
};
exports.handleSignUp = handleSignUp;
const handleUserInfo = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: '토큰이 필요합니다.' });
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prismaClient_1.default.user.findUnique({ where: { id: payload.id } });
        if (!user)
            return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
        return res.status(200).json({ id: user.id, userType: user.userType, phoneNumber: user.phoneNumber });
    }
    catch (err) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};
exports.handleUserInfo = handleUserInfo;

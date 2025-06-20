// src/index.ts
import express from 'express';
import cors from 'cors';
import { handleOrderRequest } from './orderHandler';
import { handleSignIn, handleSignUp, handleUserInfo } from './authHandler';

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors({
  origin: 'https://dooringkr.vercel.app/login',
  credentials: true
}));
app.use(express.json());

app.post('/order', handleOrderRequest);

app.post('/api/auth/signin', handleSignIn);
app.post('/api/auth/signup', handleSignUp);
app.get('/api/auth/user', handleUserInfo);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('▶ process.env.PORT =', process.env.PORT);

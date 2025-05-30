// src/index.ts
import express from 'express';
import cors from 'cors';
import { handleOrderRequest } from './orderHandler';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'https://dooringkr.vercel.app/login',
  credentials: true
}));
app.use(express.json());

app.post('/order', handleOrderRequest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

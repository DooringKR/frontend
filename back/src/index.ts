import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth'
import appUserRouter from './routes/app_user'
import orderRouter from './routes/order'
import cartRouter from './routes/cart'
import cartItemRouter from './routes/cart_item'
import orderItemRouter from './routes/order_item'
import dotenv from "dotenv"
import path from 'path';

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors({
  origin: [
    'https://dooringkr.vercel.app/login', 
    'http://localhost:3000'               
  ],
  credentials: true,
}));

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/app_user', appUserRouter);
app.use('/cart', cartRouter);
app.use('/cart_item', cartItemRouter);
app.use('/order_item', orderItemRouter);

app.use('/images', cors(), express.static(path.join(__dirname, '../public/images')));
console.log(`Server running on port ${PORT}`);
console.log('▶ process.env.PORT =', process.env.PORT);

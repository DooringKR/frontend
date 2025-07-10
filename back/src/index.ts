import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth'
import appUserRouter from './routes/app_user'
import orderRouter from './routes/order'
import cartRouter from './routes/cart'
import cartItemRouter from './routes/cart_item'


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

app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/app_user', appUserRouter);
app.use('/cart', cartRouter);
app.use('/cart_item', cartItemRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('▶ process.env.PORT =', process.env.PORT);

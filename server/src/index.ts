import express,{ Request, Response } from 'express';
import dotenv from 'dotenv';
import {userRoutes} from './routes/userRoutes';
import {roleRoutes} from './routes/roleRoutes'
import {productRoutes} from './routes/product_route'
import cors from 'cors';
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/products', productRoutes);
const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

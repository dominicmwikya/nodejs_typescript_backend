import express,{ Request, Response } from 'express';
import dotenv from 'dotenv';
import {userRoutes} from './routes/userRoutes';
import {roleRoutes} from './routes/roleRoutes'
import cors from 'cors';
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);
app.use('/roles', roleRoutes)
const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

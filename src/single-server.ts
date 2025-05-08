import dotenv from 'dotenv';
import { startServer } from './server';

dotenv.config();

export const PORT = Number(process.env.PORT ?? 4000);

startServer(PORT);

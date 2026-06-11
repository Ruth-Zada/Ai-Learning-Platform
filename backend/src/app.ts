import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import learningRoutes from './routes/learning.routes';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api', learningRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 השרת רץ בהצלחה ברמה גבוהה על פורט ${PORT}`);
  console.log(`🔑 OpenAI Key loaded: ${!!process.env.OPENAI_API_KEY}`);
});

export default app;
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import projectRoutes from './routes/projectRoutes';
import skillRoutes from './routes/skillRoutes';
import profileRoutes from './routes/profileRoutes';
import statsRoutes from './routes/statsRoutes';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import propertiesRoutes from './routes/properties';
import leadsRoutes from './routes/leads';
import contactRoutes from './routes/contact';
import subscriptionsRoutes from './routes/subscriptions';
import testimonialsRoutes from './routes/testimonials';
import aiProvidersRoutes from './routes/ai-providers';
import contentSourcesRoutes from './routes/content-sources';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/ai-providers', aiProvidersRoutes);
app.use('/api/content-sources', contentSourcesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

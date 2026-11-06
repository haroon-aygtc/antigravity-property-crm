import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const topicSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  keywords: z.array(z.string()),
  sourceUrls: z.array(z.string()),
  noveltyScore: z.number().optional(),
  trendingScore: z.number().optional(),
  menaRelevance: z.number().optional(),
  status: z.enum(['PENDING', 'RESEARCHING', 'READY', 'GENERATING', 'COMPLETED', 'FAILED']).optional(),
  researchData: z.any().optional(),
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;

    const topics = await prisma.contentTopic.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.contentTopic.count({ where });

    res.json({ topics, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content topics' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = topicSchema.parse(req.body);

    const topic = await prisma.contentTopic.create({
      data,
    });

    res.status(201).json(topic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create content topic' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = topicSchema.partial().parse(req.body);

    const topic = await prisma.contentTopic.update({
      where: { id: req.params.id },
      data,
    });

    res.json(topic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update content topic' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.contentTopic.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content topic' });
  }
});

export default router;

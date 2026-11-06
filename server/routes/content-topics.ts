import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const sourceSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['RSS', 'NEWS_API', 'YOUTUBE', 'TWITTER', 'TIKTOK', 'REDDIT', 'CUSTOM']),
  url: z.string().url(),
  apiKey: z.string().optional(),
  enabled: z.boolean().optional(),
  priority: z.number().optional(),
  filters: z.any().optional(),
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const sources = await prisma.contentSource.findMany({
      orderBy: { priority: 'desc' },
    });

    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content sources' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = sourceSchema.parse(req.body);

    const source = await prisma.contentSource.create({
      data,
    });

    res.status(201).json(source);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create content source' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = sourceSchema.partial().parse(req.body);

    const source = await prisma.contentSource.update({
      where: { id: req.params.id },
      data,
    });

    res.json(source);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update content source' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.contentSource.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content source' });
  }
});

export default router;

import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    const subscription = await prisma.subscription.create({
      data: {
        email,
        status: 'ACTIVE',
      },
    });

    res.status(201).json(subscription);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;

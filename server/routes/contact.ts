import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'NEW',
      },
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

router.get('/', async (req, res) => {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

export default router;

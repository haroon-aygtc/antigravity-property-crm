import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyId: propertyId || undefined,
        status: 'NEW',
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    await prisma.activity.create({
      data: {
        userId: lead.assignedToId || 'system',
        action: 'New lead created',
        module: 'CRM',
        details: `Lead from ${name} (${email})`,
        metadata: { leadId: lead.id },
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      leads,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.update({
      where: { id },
      data: req.body,
      include: {
        property: true,
        assignedTo: true,
      },
    });

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

export default router;

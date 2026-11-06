import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '12',
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      status = 'AVAILABLE',
      featured,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { status };

    if (propertyType) where.propertyType = propertyType;
    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms as string) };
    if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms as string) };
    if (featured) where.featured = featured === 'true';
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take,
        orderBy: { [sort as string]: order },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      properties,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

router.post('/', async (req, res) => {
  try {
    const property = await prisma.property.create({
      data: req.body,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.update({
      where: { id },
      data: req.body,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.property.delete({ where: { id } });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;

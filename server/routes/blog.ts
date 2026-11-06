import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const blogPostSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    category: z.string(),
    status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).optional(),
    publishedAt: z.string().optional(),
    scheduledFor: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
});

router.get('/', async (req, res) => {
    try {
        const { status, category, limit = 50, offset = 0 } = req.query;

        const where: any = {};
        if (status) where.status = status;
        if (category) where.category = category;

        const posts = await prisma.blogPost.findMany({
            where,
            take: Number(limit),
            skip: Number(offset),
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.blogPost.count({ where });

        res.json({ posts, total });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { id: req.params.id },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await prisma.blogPost.update({
            where: { id: req.params.id },
            data: { views: { increment: 1 } },
        });

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const data = blogPostSchema.parse(req.body);

        const post = await prisma.blogPost.create({
            data: {
                ...data,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
                scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
                authorId: req.user?.id,
            },
        });

        res.status(201).json(post);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create blog post' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const data = blogPostSchema.partial().parse(req.body);

        const post = await prisma.blogPost.update({
            where: { id: req.params.id },
            data: {
                ...data,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
                scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
            },
        });

        res.json(post);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to update blog post' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.blogPost.delete({
            where: { id: req.params.id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

router.post('/:id/publish', authenticateToken, async (req, res) => {
    try {
        const post = await prisma.blogPost.update({
            where: { id: req.params.id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
            },
        });

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to publish blog post' });
    }
});

export default router;

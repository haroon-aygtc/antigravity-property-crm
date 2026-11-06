import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';
import { encrypt, decrypt } from '../lib';

const router = Router();

const providerSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['OPENAI', 'CLAUDE', 'GEMINI', 'GROQ', 'OPENROUTER', 'GROK']),
    apiKey: z.string().min(1),
    models: z.array(z.string()).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ERROR']).optional(),
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const providers = await prisma.aIProvider.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const sanitized = providers.map(p => ({
            ...p,
            apiKey: '***' + p.apiKey.slice(-4),
        }));

        res.json(sanitized);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI providers' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const provider = await prisma.aIProvider.findUnique({
            where: { id: req.params.id },
            include: { templates: true },
        });

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        res.json({
            ...provider,
            apiKey: '***' + provider.apiKey.slice(-4),
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI provider' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const data = providerSchema.parse(req.body);

        const encryptedKey = encrypt(data.apiKey);

        const provider = await prisma.aIProvider.create({
            data: {
                ...data,
                apiKey: encryptedKey,
            },
        });

        res.status(201).json({
            ...provider,
            apiKey: '***' + data.apiKey.slice(-4),
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create AI provider' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const data = providerSchema.partial().parse(req.body);

        const updateData: any = { ...data };
        if (data.apiKey) {
            updateData.apiKey = encrypt(data.apiKey);
        }

        const provider = await prisma.aIProvider.update({
            where: { id: req.params.id },
            data: updateData,
        });

        res.json({
            ...provider,
            apiKey: '***' + (data.apiKey || provider.apiKey).slice(-4),
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to update AI provider' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.aIProvider.delete({
            where: { id: req.params.id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete AI provider' });
    }
});

router.post('/:id/test', authenticateToken, async (req, res) => {
    try {
        const provider = await prisma.aIProvider.findUnique({
            where: { id: req.params.id },
        });

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const decryptedKey = decrypt(provider.apiKey);

        let testResult = false;
        let errorMessage = '';

        try {
            switch (provider.type) {
                case 'OPENAI':
                    const openaiRes = await fetch('https://api.openai.com/v1/models', {
                        headers: { 'Authorization': `Bearer ${decryptedKey}` },
                    });
                    testResult = openaiRes.ok;
                    break;
                case 'CLAUDE':
                    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'x-api-key': decryptedKey,
                            'anthropic-version': '2023-06-01',
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: 'claude-3-haiku-20240307',
                            max_tokens: 10,
                            messages: [{ role: 'user', content: 'test' }],
                        }),
                    });
                    testResult = claudeRes.ok;
                    break;
                case 'GEMINI':
                    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${decryptedKey}`);
                    testResult = geminiRes.ok;
                    break;
                case 'GROQ':
                    const groqRes = await fetch('https://api.groq.com/openai/v1/models', {
                        headers: { 'Authorization': `Bearer ${decryptedKey}` },
                    });
                    testResult = groqRes.ok;
                    break;
                case 'OPENROUTER':
                    const openrouterRes = await fetch('https://openrouter.ai/api/v1/models', {
                        headers: { 'Authorization': `Bearer ${decryptedKey}` },
                    });
                    testResult = openrouterRes.ok;
                    break;
                case 'GROK':
                    const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${decryptedKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: 'grok-beta',
                            messages: [{ role: 'user', content: 'test' }],
                            max_tokens: 10,
                        }),
                    });
                    testResult = grokRes.ok;
                    break;
            }
        } catch (err: any) {
            errorMessage = err.message;
        }

        await prisma.aIProvider.update({
            where: { id: req.params.id },
            data: {
                status: testResult ? 'ACTIVE' : 'ERROR',
                lastChecked: new Date(),
            },
        });

        res.json({ success: testResult, error: errorMessage });
    } catch (error) {
        res.status(500).json({ error: 'Failed to test AI provider' });
    }
});

router.post('/:id/usage', authenticateToken, async (req, res) => {
    try {
        const { model, operation, tokensUsed, cost, duration, success, errorMessage, metadata } = req.body;

        const log = await prisma.aIUsageLog.create({
            data: {
                providerId: req.params.id,
                model,
                operation,
                tokensUsed,
                cost,
                duration,
                success,
                errorMessage,
                metadata,
            },
        });

        await prisma.aIProvider.update({
            where: { id: req.params.id },
            data: {
                tokensUsed: { increment: tokensUsed },
                cost: { increment: cost },
                requests: { increment: 1 },
            },
        });

        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to log AI usage' });
    }
});

export default router;

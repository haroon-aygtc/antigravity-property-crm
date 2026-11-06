import { prisma } from '../lib/prisma';

interface GenerateArticleParams {
    topicId: string;
}

export class ArticleGenerationService {
    async generateArticle({ topicId }: GenerateArticleParams): Promise<string> {
        const topic = await prisma.contentTopic.findUnique({
            where: { id: topicId },
        });

        if (!topic) {
            throw new Error('Topic not found');
        }

        // TODO: Implement actual AI generation here
        // For now, return a placeholder article based on the topic

        return `
# ${topic.title}

${topic.description || ''}

## Introduction
This is a generated article about ${topic.title}. 

## Key Points
${topic.keywords.map(k => `- ${k}`).join('\n')}

## Conclusion
In conclusion, ${topic.title} is an interesting subject that requires further discussion.
    `.trim();
    }
}

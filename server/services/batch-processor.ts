import { prisma } from '../lib/prisma';
import { ContentResearchService } from './content-research';
import { ArticleGenerationService } from './article-generation';
import { QualityCheckService } from './quality-check';
import { PublishingService } from './publishing';

export class BatchProcessor {
  private researchService = new ContentResearchService();
  private generationService = new ArticleGenerationService();
  private qualityService = new QualityCheckService();
  private publishingService = new PublishingService();

  async processDailyBatch(): Promise<void> {
    console.log('Starting daily batch process...');

    try {
      const researchJob = await this.createJob('CONTENT_RESEARCH');
      await this.executeResearch(researchJob.id);

      const topics = await prisma.contentTopic.findMany({
        where: { status: 'READY' },
        take: 3,
      });

      for (const topic of topics) {
        try {
          const generationJob = await this.createJob('ARTICLE_GENERATION', { topicId: topic.id });
          await this.executeGeneration(generationJob.id, topic.id);

          const qualityJob = await this.createJob('QUALITY_CHECK', { topicId: topic.id });
          await this.executeQualityCheck(qualityJob.id, topic.id);

          const publishJob = await this.createJob('PUBLISH', { topicId: topic.id });
          await this.executePublish(publishJob.id, topic.id);
        } catch (error: any) {
          console.error(`Failed to process topic ${topic.id}:`, error);
          await prisma.contentTopic.update({
            where: { id: topic.id },
            data: { status: 'FAILED' },
          });
        }
      }

      console.log('Daily batch process completed successfully');
    } catch (error) {
      console.error('Daily batch process failed:', error);
      throw error;
    }
  }

  private async createJob(type: any, data?: any) {
    return await prisma.batchJob.create({
      data: {
        type,
        scheduledFor: new Date(),
        data,
      },
    });
  }

  private async executeResearch(jobId: string): Promise<void> {
    try {
      await this.updateJobStatus(jobId, 'RUNNING');

      const results = await this.researchService.researchTopics(3);

      for (const result of results) {
        await prisma.contentTopic.create({
          data: {
            ...result,
            status: 'READY',
          },
        });
      }

      await this.updateJobStatus(jobId, 'COMPLETED', { topicsFound: results.length });
    } catch (error: any) {
      await this.updateJobStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private async executeGeneration(jobId: string, topicId: string): Promise<void> {
    try {
      await this.updateJobStatus(jobId, 'RUNNING');
      await prisma.contentTopic.update({
        where: { id: topicId },
        data: { status: 'GENERATING' },
      });

      const content = await this.generationService.generateArticle({ topicId });

      const topic = await prisma.contentTopic.findUnique({ where: { id: topicId } });
      if (!topic) throw new Error('Topic not found');

      const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const post = await prisma.blogPost.create({
        data: {
          title: topic.title,
          slug,
          content,
          excerpt: topic.description || content.substring(0, 200),
          tags: topic.keywords,
          category: 'AI & Technology',
          status: 'DRAFT',
          aiGenerated: true,
          noveltyScore: topic.noveltyScore,
        },
      });

      await prisma.contentTopic.update({
        where: { id: topicId },
        data: {
          status: 'COMPLETED',
          generatedPostId: post.id,
        },
      });

      await this.updateJobStatus(jobId, 'COMPLETED', { postId: post.id });
    } catch (error: any) {
      await this.updateJobStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private async executeQualityCheck(jobId: string, topicId: string): Promise<void> {
    try {
      await this.updateJobStatus(jobId, 'RUNNING');

      const topic = await prisma.contentTopic.findUnique({ where: { id: topicId } });
      if (!topic?.generatedPostId) throw new Error('No post found for topic');

      const post = await prisma.blogPost.findUnique({ where: { id: topic.generatedPostId } });
      if (!post) throw new Error('Post not found');

      const result = await this.qualityService.checkQuality(post.content, post.title);

      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          qualityScore: (result.scores.originality + result.scores.readability) / 2,
          plagiarismScore: result.scores.plagiarism,
        },
      });

      if (!result.passed) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { status: 'DRAFT' },
        });

        await this.updateJobStatus(jobId, 'COMPLETED', {
          passed: false,
          issues: result.issues,
        });
      } else {
        await this.updateJobStatus(jobId, 'COMPLETED', { passed: true });
      }
    } catch (error: any) {
      await this.updateJobStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private async executePublish(jobId: string, topicId: string): Promise<void> {
    try {
      await this.updateJobStatus(jobId, 'RUNNING');

      const topic = await prisma.contentTopic.findUnique({ where: { id: topicId } });
      if (!topic?.generatedPostId) throw new Error('No post found for topic');

      const post = await prisma.blogPost.findUnique({ where: { id: topic.generatedPostId } });
      if (!post) throw new Error('Post not found');

      if (post.qualityScore && post.qualityScore < 0.7) {
        throw new Error('Post quality score too low for publishing');
      }

      await this.publishingService.publish(post.id);

      await this.updateJobStatus(jobId, 'COMPLETED', { postId: post.id });
    } catch (error: any) {
      await this.updateJobStatus(jobId, 'FAILED', null, error.message);
      throw error;
    }
  }

  private async updateJobStatus(jobId: string, status: any, result?: any, errorMessage?: string) {
    await prisma.batchJob.update({
      where: { id: jobId },
      data: {
        status,
        result,
        errorMessage,
        startedAt: status === 'RUNNING' ? new Date() : undefined,
        completedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined,
      },
    });
  }
}

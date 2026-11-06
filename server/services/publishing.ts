import { prisma } from '../lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export class PublishingService {
  async publish(postId: string): Promise<void> {
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) throw new Error('Post not found');

    await this.generateMDX(post);
    await this.generateSEO(post);
    await this.updateSitemap(post);

    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    await this.scheduleSocialPosts(post);
  }

  private async generateMDX(post: any): Promise<void> {
    const mdxContent = `---
title: "${post.title}"
date: "${new Date().toISOString()}"
excerpt: "${post.excerpt || ''}"
featuredImage: "${post.featuredImage || ''}"
tags: ${JSON.stringify(post.tags)}
category: "${post.category}"
---

${post.content}
`;

    const blogDir = path.join(process.cwd(), '../public/blog');
    await fs.mkdir(blogDir, { recursive: true });

    const filePath = path.join(blogDir, `${post.slug}.mdx`);
    await fs.writeFile(filePath, mdxContent, 'utf-8');
  }

  private async generateSEO(post: any): Promise<void> {
    const seoTitle = post.seoTitle || post.title;
    const seoDescription = post.seoDescription || post.excerpt || post.content.substring(0, 160);
    const seoKeywords = post.seoKeywords || post.tags;

    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        seoTitle,
        seoDescription,
        seoKeywords,
        metadata: {
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: seoTitle,
            description: seoDescription,
            datePublished: new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'AI Content Platform',
            },
            keywords: seoKeywords.join(', '),
          },
        },
      },
    });
  }

  private async updateSitemap(post: any): Promise<void> {
    const sitemapPath = path.join(process.cwd(), '../public/sitemap.xml');
    
    let sitemap = '';
    try {
      sitemap = await fs.readFile(sitemapPath, 'utf-8');
    } catch {
      sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    }

    const newEntry = `  <url>
    <loc>${process.env.FRONTEND_URL}/blog/${post.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    sitemap = sitemap.replace('</urlset>', `${newEntry}\n</urlset>`);
    await fs.writeFile(sitemapPath, sitemap, 'utf-8');
  }

  private async scheduleSocialPosts(post: any): Promise<void> {
    const platforms: Array<'TWITTER' | 'LINKEDIN' | 'FACEBOOK'> = ['TWITTER', 'LINKEDIN', 'FACEBOOK'];

    for (const platform of platforms) {
      const content = this.generateSocialContent(post, platform);

      await prisma.socialPost.create({
        data: {
          blogPostId: post.id,
          platform,
          content,
          status: 'SCHEDULED',
          scheduledFor: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
    }
  }

  private generateSocialContent(post: any, platform: string): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${baseUrl}/blog/${post.slug}`;

    switch (platform) {
      case 'TWITTER':
        return `${post.title}\n\n${post.excerpt?.substring(0, 200) || ''}\n\n${url}\n\n${post.tags.slice(0, 3).map((t: string) => `#${t}`).join(' ')}`;
      case 'LINKEDIN':
        return `${post.title}\n\n${post.excerpt || ''}\n\nRead more: ${url}\n\n${post.tags.slice(0, 5).map((t: string) => `#${t}`).join(' ')}`;
      case 'FACEBOOK':
        return `${post.title}\n\n${post.excerpt || ''}\n\n${url}`;
      default:
        return `${post.title}\n\n${url}`;
    }
  }
}

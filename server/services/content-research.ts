import { prisma } from '../lib/prisma';
import Parser from 'rss-parser';
import axios from 'axios';

const parser = new Parser();

interface ResearchResult {
  title: string;
  description: string;
  keywords: string[];
  sourceUrls: string[];
  noveltyScore: number;
  trendingScore: number;
  menaRelevance: number;
  researchData: any;
}

export class ContentResearchService {
  async researchTopics(count: number = 3): Promise<ResearchResult[]> {
    const sources = await prisma.contentSource.findMany({
      where: { enabled: true },
      orderBy: { priority: 'desc' },
    });

    const results: ResearchResult[] = [];

    for (const source of sources) {
      try {
        let items: any[] = [];

        switch (source.type) {
          case 'RSS':
            items = await this.fetchRSS(source.url);
            break;
          case 'NEWS_API':
            items = await this.fetchNewsAPI(source.url, source.apiKey);
            break;
          case 'REDDIT':
            items = await this.fetchReddit(source.url);
            break;
          default:
            continue;
        }

        for (const item of items.slice(0, count)) {
          const result = await this.analyzeItem(item, source);
          results.push(result);
        }

        await prisma.contentSource.update({
          where: { id: source.id },
          data: { lastFetchedAt: new Date() },
        });
      } catch (error) {
        console.error(`Failed to fetch from ${source.name}:`, error);
      }
    }

    return results.sort((a, b) => 
      (b.noveltyScore + b.trendingScore + b.menaRelevance) - 
      (a.noveltyScore + a.trendingScore + a.menaRelevance)
    ).slice(0, count);
  }

  private async fetchRSS(url: string): Promise<any[]> {
    const feed = await parser.parseURL(url);
    return feed.items.map(item => ({
      title: item.title,
      description: item.contentSnippet || item.content,
      link: item.link,
      pubDate: item.pubDate,
    }));
  }

  private async fetchNewsAPI(url: string, apiKey?: string): Promise<any[]> {
    if (!apiKey) throw new Error('NewsAPI key required');
    
    const response = await axios.get(url, {
      params: { apiKey },
    });

    return response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      link: article.url,
      pubDate: article.publishedAt,
    }));
  }

  private async fetchReddit(url: string): Promise<any[]> {
    const response = await axios.get(`${url}.json`, {
      headers: { 'User-Agent': 'ContentResearchBot/1.0' },
    });

    return response.data.data.children.map((child: any) => ({
      title: child.data.title,
      description: child.data.selftext,
      link: `https://reddit.com${child.data.permalink}`,
      pubDate: new Date(child.data.created_utc * 1000).toISOString(),
    }));
  }

  private async analyzeItem(item: any, source: any): Promise<ResearchResult> {
    const keywords = this.extractKeywords(item.title + ' ' + item.description);
    const noveltyScore = await this.calculateNoveltyScore(item.title);
    const trendingScore = this.calculateTrendingScore(item.pubDate);
    const menaRelevance = this.calculateMENARelevance(item.title + ' ' + item.description);

    return {
      title: item.title,
      description: item.description,
      keywords,
      sourceUrls: [item.link],
      noveltyScore,
      trendingScore,
      menaRelevance,
      researchData: {
        source: source.name,
        pubDate: item.pubDate,
        rawData: item,
      },
    };
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);

    const frequency: Record<string, number> = {};
    words.forEach(w => frequency[w] = (frequency[w] || 0) + 1);

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private async calculateNoveltyScore(title: string): Promise<number> {
    const existing = await prisma.blogPost.findMany({
      where: {
        title: { contains: title.split(' ').slice(0, 3).join(' ') },
      },
    });

    return Math.max(0, 1 - (existing.length * 0.2));
  }

  private calculateTrendingScore(pubDate: string): number {
    const age = Date.now() - new Date(pubDate).getTime();
    const hoursOld = age / (1000 * 60 * 60);
    return Math.max(0, 1 - (hoursOld / 24));
  }

  private calculateMENARelevance(text: string): number {
    const menaKeywords = [
      'uae', 'dubai', 'abu dhabi', 'saudi', 'qatar', 'kuwait', 'bahrain',
      'oman', 'mena', 'middle east', 'gcc', 'arab', 'emirates'
    ];

    const lowerText = text.toLowerCase();
    const matches = menaKeywords.filter(k => lowerText.includes(k)).length;
    return Math.min(1, matches * 0.3);
  }
}

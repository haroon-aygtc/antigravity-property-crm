import axios from 'axios';

interface QualityResult {
  passed: boolean;
  scores: {
    originality: number;
    plagiarism: number;
    toxicity: number;
    readability: number;
  };
  issues: string[];
}

export class QualityCheckService {
  async checkQuality(content: string, title: string): Promise<QualityResult> {
    const issues: string[] = [];
    const scores = {
      originality: 0,
      plagiarism: 0,
      toxicity: 0,
      readability: 0,
    };

    scores.originality = await this.checkOriginality(content);
    if (scores.originality < 0.9) {
      issues.push('Content may not be sufficiently original');
    }

    scores.plagiarism = await this.checkPlagiarism(content);
    if (scores.plagiarism > 0.1) {
      issues.push('Potential plagiarism detected');
    }

    scores.toxicity = this.checkToxicity(content);
    if (scores.toxicity > 0.3) {
      issues.push('Content contains potentially toxic language');
    }

    scores.readability = this.checkReadability(content);
    if (scores.readability < 0.6) {
      issues.push('Content readability could be improved');
    }

    const accessibilityIssues = this.checkAccessibility(content);
    issues.push(...accessibilityIssues);

    const passed = issues.length === 0;

    return { passed, scores, issues };
  }

  private async checkOriginality(content: string): Promise<number> {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
    return uniqueSentences.size / sentences.length;
  }

  private async checkPlagiarism(content: string): Promise<number> {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    let matchCount = 0;
    for (const sentence of sentences.slice(0, 5)) {
      try {
        const response = await axios.get('https://www.google.com/search', {
          params: { q: `"${sentence.trim()}"` },
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        
        if (response.data.includes('did not match any documents')) {
          continue;
        }
        matchCount++;
      } catch (error) {
        continue;
      }
    }

    return matchCount / Math.min(sentences.length, 5);
  }

  private checkToxicity(content: string): number {
    const toxicWords = [
      'hate', 'kill', 'stupid', 'idiot', 'dumb', 'worst', 'terrible',
      'awful', 'horrible', 'disgusting', 'pathetic', 'loser'
    ];

    const words = content.toLowerCase().split(/\s+/);
    const toxicCount = words.filter(w => toxicWords.includes(w)).length;

    return Math.min(1, toxicCount / words.length * 100);
  }

  private checkReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    return Math.max(0, Math.min(1, fleschScore / 100));
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }

    if (word.endsWith('e')) count--;
    return Math.max(1, count);
  }

  private checkAccessibility(content: string): string[] {
    const issues: string[] = [];

    const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g;
    const images = content.match(imageRegex) || [];
    
    for (const img of images) {
      const altText = img.match(/!\[([^\]]*)\]/)?.[1];
      if (!altText || altText.trim().length === 0) {
        issues.push('Image missing alt text for accessibility');
        break;
      }
    }

    const headingRegex = /^#{1,6}\s+.+$/gm;
    const headings = content.match(headingRegex) || [];
    if (headings.length === 0) {
      issues.push('Content lacks proper heading structure');
    }

    const linkRegex = /\[([^\]]+)\]\([^)]+\)/g;
    const links = content.match(linkRegex) || [];
    for (const link of links) {
      const linkText = link.match(/\[([^\]]+)\]/)?.[1];
      if (linkText && (linkText.toLowerCase() === 'click here' || linkText.toLowerCase() === 'read more')) {
        issues.push('Links should have descriptive text instead of generic phrases');
        break;
      }
    }

    return issues;
  }
}

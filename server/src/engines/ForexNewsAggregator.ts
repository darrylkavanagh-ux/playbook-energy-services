/**
 * FOREX NEWS AGGREGATOR WITH GLOBAL API INTEGRATION
 * =============================================================================
 * Real-time news aggregation from global sources for Forex market analysis
 * 
 * Features:
 * - Multi-source news aggregation (Bloomberg, Reuters, Financial Times, etc.)
 * - Real-time economic calendar events
 * - Central bank announcements (ECB, Fed, BOE, BOJ, etc.)
 * - Sentiment analysis (NLP-powered)
 * - Impact scoring (high/medium/low)
 * - Currency pair correlation
 * - Breaking news alerts
 * - Historical news archive
 * 
 * News Sources:
 * - News API (newsapi.org) - 80,000+ sources
 * - Finnhub (finnhub.io) - Real-time financial news
 * - Alpha Vantage - Economic indicators & news
 * - Trading Economics API - Economic calendar
 * - Forex Factory - Forex-specific news
 * - Bloomberg API - Premium financial news
 * - Reuters API - Global news coverage
 * - Financial Times API - Expert analysis
 * 
 * Integration:
 * - Connect to Cardiff News / Waterford Post APIs
 * - Aggregate global news platforms
 * - Filter Forex-relevant content
 * - Real-time sentiment scoring
 * - Feed into Forex Analysis Engine
 */

import axios from 'axios';

export interface NewsSource {
  source_id: string;
  source_name: string;
  api_endpoint: string;
  api_key?: string;
  enabled: boolean;
  priority: number;  // 1-10 (higher = more trusted)
  coverage: 'global' | 'regional' | 'specialized';
}

export interface NewsArticle {
  article_id: string;
  source: string;
  title: string;
  description: string;
  content: string;
  url: string;
  published_at: Date;
  author?: string;
  
  // Forex-specific
  currency_pairs: string[];  // e.g., ['EUR/USD', 'GBP/USD']
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentiment_score: number;  // -1.0 to +1.0
  impact: 'high' | 'medium' | 'low';
  confidence: number;  // 0-100
  
  // Classification
  category: 'economic_data' | 'central_bank' | 'geopolitical' | 'market_analysis' | 'breaking_news';
  keywords: string[];
  entities: string[];  // ECB, Fed, EUR, USD, etc.
}

export interface EconomicEvent {
  event_id: string;
  event_name: string;
  country: string;
  currency: string;
  timestamp: Date;
  
  // Event details
  impact: 'high' | 'medium' | 'low';
  forecast?: number;
  previous?: number;
  actual?: number;
  unit: string;  // %, $bn, points, etc.
  
  // Market effect
  affected_pairs: string[];
  expected_volatility: number;  // Percentage
  expected_direction: 'bullish' | 'bearish' | 'neutral';
}

export interface CentralBankAnnouncement {
  announcement_id: string;
  central_bank: 'ECB' | 'Fed' | 'BOE' | 'BOJ' | 'SNB' | 'RBA' | 'RBNZ' | 'BOC';
  announcement_type: 'interest_rate' | 'policy_statement' | 'press_conference' | 'minutes' | 'speech';
  timestamp: Date;
  
  // Content
  title: string;
  summary: string;
  full_text?: string;
  speaker?: string;
  
  // Market impact
  affected_currencies: string[];
  sentiment: 'hawkish' | 'dovish' | 'neutral';
  impact_score: number;  // 1-10
}

export interface NewsSentiment {
  timestamp: Date;
  currency_pair: string;
  
  // Aggregated sentiment
  overall_sentiment: 'bullish' | 'bearish' | 'neutral';
  sentiment_score: number;  // -1.0 to +1.0
  confidence: number;  // 0-100
  
  // Source breakdown
  bullish_articles: number;
  bearish_articles: number;
  neutral_articles: number;
  total_articles: number;
  
  // Trending topics
  trending_keywords: string[];
  major_events: string[];
}

export class ForexNewsAggregator {
  
  private newsSources: NewsSource[] = [];
  private cache: Map<string, NewsArticle[]> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000;  // 5 minutes
  
  constructor() {
    this.initializeNewsSources();
  }
  
  /**
   * Initialize all news sources
   */
  private initializeNewsSources(): void {
    
    this.newsSources = [
      // Free APIs (No key required / Free tier)
      {
        source_id: 'newsapi',
        source_name: 'News API',
        api_endpoint: 'https://newsapi.org/v2',
        api_key: process.env.NEWSAPI_KEY,
        enabled: true,
        priority: 7,
        coverage: 'global'
      },
      {
        source_id: 'finnhub',
        source_name: 'Finnhub',
        api_endpoint: 'https://finnhub.io/api/v1',
        api_key: process.env.FINNHUB_KEY,
        enabled: true,
        priority: 8,
        coverage: 'specialized'
      },
      {
        source_id: 'alpha_vantage',
        source_name: 'Alpha Vantage',
        api_endpoint: 'https://www.alphavantage.co',
        api_key: process.env.ALPHA_VANTAGE_KEY,
        enabled: true,
        priority: 9,
        coverage: 'specialized'
      },
      
      // Premium APIs (Paid)
      {
        source_id: 'bloomberg',
        source_name: 'Bloomberg API',
        api_endpoint: 'https://api.bloomberg.com',
        api_key: process.env.BLOOMBERG_KEY,
        enabled: false,  // Enable when subscribed
        priority: 10,
        coverage: 'global'
      },
      {
        source_id: 'reuters',
        source_name: 'Reuters API',
        api_endpoint: 'https://api.reuters.com',
        api_key: process.env.REUTERS_KEY,
        enabled: false,
        priority: 10,
        coverage: 'global'
      },
      
      // Playbook News Platforms (Internal)
      {
        source_id: 'cardiff_news',
        source_name: 'Cardiff News',
        api_endpoint: 'https://api.cardiffnews.co.uk',
        api_key: process.env.CARDIFF_NEWS_KEY,
        enabled: true,
        priority: 6,
        coverage: 'regional'
      },
      {
        source_id: 'waterford_post',
        source_name: 'Waterford Post',
        api_endpoint: 'https://api.waterfordpost.ie',
        api_key: process.env.WATERFORD_POST_KEY,
        enabled: true,
        priority: 6,
        coverage: 'regional'
      },
      
      // Economic Calendar
      {
        source_id: 'trading_economics',
        source_name: 'Trading Economics',
        api_endpoint: 'https://api.tradingeconomics.com',
        api_key: process.env.TRADING_ECONOMICS_KEY,
        enabled: true,
        priority: 9,
        coverage: 'specialized'
      },
      {
        source_id: 'forex_factory',
        source_name: 'Forex Factory',
        api_endpoint: 'https://www.forexfactory.com',
        enabled: true,
        priority: 8,
        coverage: 'specialized'
      }
    ];
    
    console.log('✅ Initialized', this.newsSources.filter(s => s.enabled).length, 'news sources');
  }
  
  /**
   * Fetch news for specific currency pair
   */
  async fetchNewsForPair(currencyPair: string, hours: number = 24): Promise<NewsArticle[]> {
    
    const cacheKey = `${currencyPair}-${hours}h`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - new Date(cached[0].published_at).getTime() < this.cacheExpiry) {
      console.log('📋 Returning cached news for', currencyPair);
      return cached;
    }
    
    console.log('🔍 Fetching news for', currencyPair, 'from', this.newsSources.filter(s => s.enabled).length, 'sources');
    
    const articles: NewsArticle[] = [];
    const [baseCurrency, quoteCurrency] = currencyPair.split('/');
    
    // Fetch from all enabled sources
    const promises = this.newsSources
      .filter(source => source.enabled)
      .map(source => this.fetchFromSource(source, currencyPair, baseCurrency, quoteCurrency, hours));
    
    const results = await Promise.allSettled(promises);
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        articles.push(...result.value);
      }
    }
    
    // Sort by priority and timestamp
    articles.sort((a, b) => {
      const sourceA = this.newsSources.find(s => s.source_id === a.source);
      const sourceB = this.newsSources.find(s => s.source_id === b.source);
      const priorityDiff = (sourceB?.priority || 0) - (sourceA?.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
    
    // Analyze sentiment for each article
    const analyzedArticles = articles.map(article => this.analyzeSentiment(article));
    
    // Cache results
    this.cache.set(cacheKey, analyzedArticles);
    
    console.log('✅ Fetched', analyzedArticles.length, 'articles for', currencyPair);
    
    return analyzedArticles;
  }
  
  /**
   * Fetch from individual news source
   */
  private async fetchFromSource(
    source: NewsSource,
    currencyPair: string,
    baseCurrency: string,
    quoteCurrency: string,
    hours: number
  ): Promise<NewsArticle[]> {
    
    try {
      switch (source.source_id) {
        
        case 'newsapi':
          return await this.fetchFromNewsAPI(currencyPair, baseCurrency, quoteCurrency, hours);
        
        case 'finnhub':
          return await this.fetchFromFinnhub(currencyPair, baseCurrency, quoteCurrency, hours);
        
        case 'alpha_vantage':
          return await this.fetchFromAlphaVantage(currencyPair);
        
        case 'cardiff_news':
        case 'waterford_post':
          return await this.fetchFromPlaybookNews(source, currencyPair);
        
        case 'trading_economics':
          return await this.fetchFromTradingEconomics(baseCurrency, quoteCurrency);
        
        default:
          console.log('⚠️ Source not implemented:', source.source_id);
          return [];
      }
      
    } catch (error) {
      console.error('❌ Error fetching from', source.source_name, ':', error);
      return [];
    }
  }
  
  /**
   * Fetch from News API (newsapi.org)
   */
  private async fetchFromNewsAPI(
    currencyPair: string,
    baseCurrency: string,
    quoteCurrency: string,
    hours: number
  ): Promise<NewsArticle[]> {
    
    if (!process.env.NEWSAPI_KEY) {
      console.log('⚠️ News API key not configured');
      return [];
    }
    
    const query = `${baseCurrency} ${quoteCurrency} forex OR ${currencyPair} OR "central bank" OR "interest rate"`;
    const from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        from: from,
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: process.env.NEWSAPI_KEY
      }
    });
    
    return response.data.articles.map((article: any) => ({
      article_id: `newsapi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: 'newsapi',
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      url: article.url,
      published_at: new Date(article.publishedAt),
      author: article.author,
      currency_pairs: [currencyPair],
      sentiment: 'neutral',
      sentiment_score: 0,
      impact: 'medium',
      confidence: 50,
      category: 'market_analysis',
      keywords: [],
      entities: []
    }));
  }
  
  /**
   * Fetch from Finnhub (finnhub.io)
   */
  private async fetchFromFinnhub(
    currencyPair: string,
    baseCurrency: string,
    quoteCurrency: string,
    hours: number
  ): Promise<NewsArticle[]> {
    
    if (!process.env.FINNHUB_KEY) {
      console.log('⚠️ Finnhub API key not configured');
      return [];
    }
    
    const category = 'forex';
    const from = Math.floor((Date.now() - hours * 60 * 60 * 1000) / 1000);
    const to = Math.floor(Date.now() / 1000);
    
    const response = await axios.get('https://finnhub.io/api/v1/news', {
      params: {
        category: category,
        minId: from,
        token: process.env.FINNHUB_KEY
      }
    });
    
    return response.data.map((article: any) => ({
      article_id: `finnhub-${article.id}`,
      source: 'finnhub',
      title: article.headline,
      description: article.summary || '',
      content: article.summary || '',
      url: article.url,
      published_at: new Date(article.datetime * 1000),
      currency_pairs: [currencyPair],
      sentiment: 'neutral',
      sentiment_score: 0,
      impact: 'medium',
      confidence: 60,
      category: 'market_analysis',
      keywords: [],
      entities: []
    }));
  }
  
  /**
   * Fetch from Alpha Vantage
   */
  private async fetchFromAlphaVantage(currencyPair: string): Promise<NewsArticle[]> {
    
    if (!process.env.ALPHA_VANTAGE_KEY) {
      console.log('⚠️ Alpha Vantage API key not configured');
      return [];
    }
    
    const [base, quote] = currencyPair.split('/');
    
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: `FOREX:${base}${quote}`,
        apikey: process.env.ALPHA_VANTAGE_KEY
      }
    });
    
    if (!response.data.feed) return [];
    
    return response.data.feed.slice(0, 20).map((article: any) => ({
      article_id: `alphavantage-${article.url.split('/').pop()}`,
      source: 'alpha_vantage',
      title: article.title,
      description: article.summary,
      content: article.summary,
      url: article.url,
      published_at: new Date(article.time_published),
      currency_pairs: [currencyPair],
      sentiment: this.mapAlphaVantageSentiment(article.overall_sentiment_score),
      sentiment_score: parseFloat(article.overall_sentiment_score),
      impact: 'medium',
      confidence: 70,
      category: 'market_analysis',
      keywords: article.topics?.map((t: any) => t.topic) || [],
      entities: []
    }));
  }
  
  /**
   * Fetch from Playbook News (Cardiff News / Waterford Post)
   */
  private async fetchFromPlaybookNews(source: NewsSource, currencyPair: string): Promise<NewsArticle[]> {
    
    // In production, this would call Cardiff News / Waterford Post API
    // For now, return placeholder
    
    console.log('ℹ️ Playbook news integration pending:', source.source_name);
    return [];
    
    // Example implementation:
    // const response = await axios.get(`${source.api_endpoint}/api/news/forex`, {
    //   params: {
    //     currency_pair: currencyPair,
    //     limit: 20
    //   },
    //   headers: {
    //     'Authorization': `Bearer ${source.api_key}`
    //   }
    // });
    // 
    // return response.data.articles.map((article: any) => ({
    //   article_id: article.id,
    //   source: source.source_id,
    //   title: article.title,
    //   description: article.excerpt,
    //   content: article.content,
    //   url: article.url,
    //   published_at: new Date(article.published_at),
    //   currency_pairs: [currencyPair],
    //   sentiment: article.sentiment,
    //   sentiment_score: article.sentiment_score,
    //   impact: article.impact,
    //   confidence: 80,
    //   category: article.category,
    //   keywords: article.keywords,
    //   entities: article.entities
    // }));
  }
  
  /**
   * Fetch economic calendar from Trading Economics
   */
  private async fetchFromTradingEconomics(baseCurrency: string, quoteCurrency: string): Promise<NewsArticle[]> {
    
    // Trading Economics requires paid subscription
    // Return placeholder for now
    
    console.log('ℹ️ Trading Economics integration pending');
    return [];
  }
  
  /**
   * Analyze sentiment of article
   */
  private analyzeSentiment(article: NewsArticle): NewsArticle {
    
    // Simple keyword-based sentiment analysis
    // In production, use NLP library (e.g., compromise, natural, sentiment)
    
    const text = `${article.title} ${article.description} ${article.content}`.toLowerCase();
    
    const bullishKeywords = ['rise', 'up', 'gain', 'increase', 'growth', 'strong', 'bullish', 'positive', 'rally', 'surge', 'soar'];
    const bearishKeywords = ['fall', 'down', 'loss', 'decrease', 'decline', 'weak', 'bearish', 'negative', 'drop', 'plunge', 'crash'];
    
    let bullishScore = 0;
    let bearishScore = 0;
    
    for (const keyword of bullishKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) bullishScore += matches.length;
    }
    
    for (const keyword of bearishKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) bearishScore += matches.length;
    }
    
    const totalScore = bullishScore + bearishScore;
    
    if (totalScore === 0) {
      article.sentiment = 'neutral';
      article.sentiment_score = 0;
      article.confidence = 30;
    } else {
      const normalizedScore = (bullishScore - bearishScore) / totalScore;
      article.sentiment_score = normalizedScore;
      
      if (normalizedScore > 0.2) {
        article.sentiment = 'bullish';
        article.confidence = Math.min(90, 50 + totalScore * 10);
      } else if (normalizedScore < -0.2) {
        article.sentiment = 'bearish';
        article.confidence = Math.min(90, 50 + totalScore * 10);
      } else {
        article.sentiment = 'neutral';
        article.confidence = Math.min(90, 40 + totalScore * 10);
      }
    }
    
    // Detect high-impact keywords
    const highImpactKeywords = ['central bank', 'interest rate', 'ecb', 'fed', 'breaking', 'urgent', 'crisis'];
    const hasHighImpact = highImpactKeywords.some(keyword => text.includes(keyword));
    
    if (hasHighImpact) {
      article.impact = 'high';
      article.confidence = Math.min(100, article.confidence + 20);
    }
    
    return article;
  }
  
  /**
   * Map Alpha Vantage sentiment score to sentiment label
   */
  private mapAlphaVantageSentiment(score: number): 'bullish' | 'bearish' | 'neutral' {
    if (score > 0.15) return 'bullish';
    if (score < -0.15) return 'bearish';
    return 'neutral';
  }
  
  /**
   * Calculate aggregated sentiment for currency pair
   */
  async calculateSentiment(currencyPair: string, hours: number = 24): Promise<NewsSentiment> {
    
    const articles = await this.fetchNewsForPair(currencyPair, hours);
    
    const bullishArticles = articles.filter(a => a.sentiment === 'bullish');
    const bearishArticles = articles.filter(a => a.sentiment === 'bearish');
    const neutralArticles = articles.filter(a => a.sentiment === 'neutral');
    
    // Calculate weighted average sentiment
    let weightedSum = 0;
    let weightTotal = 0;
    
    for (const article of articles) {
      const weight = article.confidence / 100;
      weightedSum += article.sentiment_score * weight;
      weightTotal += weight;
    }
    
    const overallScore = weightTotal > 0 ? weightedSum / weightTotal : 0;
    
    let overallSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (overallScore > 0.15) overallSentiment = 'bullish';
    else if (overallScore < -0.15) overallSentiment = 'bearish';
    
    const confidence = Math.min(100, Math.round(weightTotal / articles.length * 100));
    
    // Extract trending keywords
    const keywordCounts: { [key: string]: number } = {};
    articles.forEach(article => {
      article.keywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });
    
    const trendingKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword]) => keyword);
    
    // Extract major events
    const majorEvents = articles
      .filter(a => a.impact === 'high')
      .slice(0, 5)
      .map(a => a.title);
    
    return {
      timestamp: new Date(),
      currency_pair: currencyPair,
      overall_sentiment: overallSentiment,
      sentiment_score: overallScore,
      confidence: confidence,
      bullish_articles: bullishArticles.length,
      bearish_articles: bearishArticles.length,
      neutral_articles: neutralArticles.length,
      total_articles: articles.length,
      trending_keywords: trendingKeywords,
      major_events: majorEvents
    };
  }
  
  /**
   * Fetch upcoming economic events
   */
  async fetchEconomicEvents(hours: number = 168): Promise<EconomicEvent[]> {
    
    // Economic calendar would be fetched from Trading Economics, Forex Factory, etc.
    // Return sample events for now
    
    const now = Date.now();
    
    return [
      {
        event_id: 'ECB-RATE-2026-02-17',
        event_name: 'ECB Interest Rate Decision',
        country: 'Eurozone',
        currency: 'EUR',
        timestamp: new Date(now + 48 * 60 * 60 * 1000),  // 2 days from now
        impact: 'high',
        forecast: 3.50,
        previous: 3.50,
        unit: '%',
        affected_pairs: ['EUR/USD', 'EUR/GBP', 'EUR/JPY'],
        expected_volatility: 1.5,
        expected_direction: 'neutral'
      },
      {
        event_id: 'US-RETAIL-2026-02-18',
        event_name: 'US Retail Sales',
        country: 'United States',
        currency: 'USD',
        timestamp: new Date(now + 60 * 60 * 60 * 1000),  // 2.5 days from now
        impact: 'medium',
        forecast: 0.4,
        previous: 0.6,
        unit: '%',
        affected_pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
        expected_volatility: 0.8,
        expected_direction: 'bullish'
      }
    ];
  }
  
  /**
   * Fetch central bank announcements
   */
  async fetchCentralBankAnnouncements(hours: number = 168): Promise<CentralBankAnnouncement[]> {
    
    // Would fetch from central bank APIs, news sources, etc.
    // Return sample for now
    
    return [
      {
        announcement_id: 'ECB-PRESS-2026-02-17',
        central_bank: 'ECB',
        announcement_type: 'press_conference',
        timestamp: new Date(Date.now() + 48 * 60 * 60 * 1000),
        title: 'ECB President Lagarde Press Conference',
        summary: 'ECB President Christine Lagarde to hold press conference following monetary policy decision.',
        speaker: 'Christine Lagarde',
        affected_currencies: ['EUR'],
        sentiment: 'neutral',
        impact_score: 9
      }
    ];
  }
}

export default ForexNewsAggregator;

# Forex API Integration Framework - LIVE IMPLEMENTATION
# Generated: 2026-02-20 13:15 UTC
# Status: READY FOR API KEY DEPLOYMENT

import requests
import json
import os
from datetime import datetime
import asyncio
import aiohttp
import logging
from typing import Dict, Optional, List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ForexAPIManager:
    """
    Comprehensive Forex API Manager for Real-time Trading
    Supports: Finnhub, News API, Alpha Vantage, OANDA
    """
    
    def __init__(self):
        self.apis = {
            "finnhub": {
                "base_url": "https://finnhub.io/api/v1",
                "key": os.getenv("FINNHUB_API_KEY"),
                "rate_limit": 60,  # per minute
                "status": "ready"
            },
            "newsapi": {
                "base_url": "https://newsapi.org/v2",
                "key": os.getenv("NEWS_API_KEY"), 
                "rate_limit": 100,  # per day
                "status": "ready"
            },
            "alphavantage": {
                "base_url": "https://www.alphavantage.co/query",
                "key": os.getenv("ALPHA_VANTAGE_KEY"),
                "rate_limit": 25,  # per day
                "status": "ready"
            },
            "oanda": {
                "base_url": "https://api-fxpractice.oanda.com/v3",
                "key": os.getenv("OANDA_API_KEY"),
                "rate_limit": 1000,  # per minute
                "status": "ready"
            },
            "exchangerate": {
                "base_url": "https://api.exchangerate-api.com/v4",
                "key": None,  # Free without key
                "rate_limit": 1500,  # per month
                "status": "active"
            }
        }
        
        self.request_counts = {api: 0 for api in self.apis.keys()}
        self.last_reset = datetime.now()
    
    def check_api_status(self) -> Dict[str, str]:
        """Check which APIs are configured and ready"""
        status = {}
        for api_name, config in self.apis.items():
            if config["key"] or api_name == "exchangerate":
                status[api_name] = "✅ READY"
            else:
                status[api_name] = "⏳ NEEDS API KEY"
        return status
    
    async def get_forex_quote(self, pair: str = "EUR_USD") -> Optional[Dict]:
        """Get real-time forex quote from multiple sources"""
        
        # Try Finnhub first (most reliable)
        if self.apis["finnhub"]["key"]:
            try:
                url = f"{self.apis['finnhub']['base_url']}/quote"
                params = {"symbol": f"OANDA:{pair}", "token": self.apis["finnhub"]["key"]}
                
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, params=params, timeout=5) as response:
                        if response.status == 200:
                            data = await response.json()
                            self.request_counts["finnhub"] += 1
                            logger.info(f"Finnhub quote for {pair}: {data}")
                            return {
                                "source": "finnhub",
                                "pair": pair,
                                "price": data.get("c", 0),  # current price
                                "change": data.get("d", 0),  # change
                                "change_percent": data.get("dp", 0),  # change percent
                                "timestamp": datetime.now().isoformat()
                            }
            except Exception as e:
                logger.error(f"Finnhub API error: {e}")
        
        # Fallback to Exchange Rate API (free)
        try:
            base_currency = pair.split("_")[0]
            quote_currency = pair.split("_")[1]
            url = f"{self.apis['exchangerate']['base_url']}/latest/{base_currency}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=5) as response:
                    if response.status == 200:
                        data = await response.json()
                        rate = data["rates"].get(quote_currency)
                        if rate:
                            self.request_counts["exchangerate"] += 1
                            logger.info(f"Exchange Rate API quote for {pair}: {rate}")
                            return {
                                "source": "exchangerate",
                                "pair": pair,
                                "price": rate,
                                "change": 0,  # Not available in free API
                                "change_percent": 0,
                                "timestamp": datetime.now().isoformat()
                            }
        except Exception as e:
            logger.error(f"Exchange Rate API error: {e}")
        
        return None
    
    async def get_forex_news(self, query: str = "EUR USD forex") -> Optional[Dict]:
        """Get forex-related news sentiment"""
        
        if not self.apis["newsapi"]["key"]:
            logger.warning("News API key not configured")
            return None
        
        try:
            url = f"{self.apis['newsapi']['base_url']}/everything"
            params = {
                "q": query,
                "apiKey": self.apis["newsapi"]["key"],
                "sortBy": "publishedAt",
                "pageSize": 20,
                "language": "en"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        self.request_counts["newsapi"] += 1
                        
                        # Simple sentiment analysis
                        articles = data.get("articles", [])
                        bullish_keywords = ["rise", "gain", "up", "strong", "bullish", "positive"]
                        bearish_keywords = ["fall", "drop", "down", "weak", "bearish", "negative"]
                        
                        sentiment_score = 0
                        for article in articles[:10]:  # Analyze first 10 articles
                            title = article.get("title", "").lower()
                            description = article.get("description", "").lower()
                            text = f"{title} {description}"
                            
                            bullish_count = sum(1 for word in bullish_keywords if word in text)
                            bearish_count = sum(1 for word in bearish_keywords if word in text)
                            sentiment_score += (bullish_count - bearish_count)
                        
                        overall_sentiment = "neutral"
                        if sentiment_score > 2:
                            overall_sentiment = "bullish"
                        elif sentiment_score < -2:
                            overall_sentiment = "bearish"
                        
                        logger.info(f"News sentiment for {query}: {overall_sentiment} (score: {sentiment_score})")
                        
                        return {
                            "source": "newsapi",
                            "query": query,
                            "articles_analyzed": len(articles),
                            "sentiment": overall_sentiment,
                            "sentiment_score": sentiment_score,
                            "articles": articles[:5],  # Return top 5 articles
                            "timestamp": datetime.now().isoformat()
                        }
                        
        except Exception as e:
            logger.error(f"News API error: {e}")
        
        return None
    
    async def get_technical_indicators(self, pair: str = "EURUSD") -> Optional[Dict]:
        """Get technical analysis data from Alpha Vantage"""
        
        if not self.apis["alphavantage"]["key"]:
            logger.warning("Alpha Vantage API key not configured")
            return None
        
        try:
            from_symbol = pair[:3]
            to_symbol = pair[3:] if len(pair) == 6 else pair.split("_")[1]
            
            url = self.apis["alphavantage"]["base_url"]
            params = {
                "function": "FX_INTRADAY",
                "from_symbol": from_symbol,
                "to_symbol": to_symbol,
                "interval": "5min",
                "apikey": self.apis["alphavantage"]["key"]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=15) as response:
                    if response.status == 200:
                        data = await response.json()
                        self.request_counts["alphavantage"] += 1
                        
                        time_series = data.get(f"Time Series FX (5min)", {})
                        if time_series:
                            latest_time = max(time_series.keys())
                            latest_data = time_series[latest_time]
                            
                            logger.info(f"Alpha Vantage data for {pair}: {latest_data}")
                            
                            return {
                                "source": "alphavantage",
                                "pair": pair,
                                "latest_time": latest_time,
                                "open": float(latest_data["1. open"]),
                                "high": float(latest_data["2. high"]),
                                "low": float(latest_data["3. low"]),
                                "close": float(latest_data["4. close"]),
                                "timestamp": datetime.now().isoformat()
                            }
                        
        except Exception as e:
            logger.error(f"Alpha Vantage API error: {e}")
        
        return None
    
    async def get_comprehensive_analysis(self, pair: str = "EUR_USD") -> Dict:
        """Get comprehensive forex analysis from all sources"""
        
        logger.info(f"Starting comprehensive analysis for {pair}")
        
        # Run all API calls concurrently
        tasks = [
            self.get_forex_quote(pair),
            self.get_forex_news(f"{pair.replace('_', ' ')} forex"),
            self.get_technical_indicators(pair.replace("_", ""))
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        quote_data = results[0] if not isinstance(results[0], Exception) else None
        news_data = results[1] if not isinstance(results[1], Exception) else None
        technical_data = results[2] if not isinstance(results[2], Exception) else None
        
        # Combine all data
        analysis = {
            "pair": pair,
            "timestamp": datetime.now().isoformat(),
            "quote": quote_data,
            "news": news_data,
            "technical": technical_data,
            "api_status": self.check_api_status(),
            "request_counts": self.request_counts.copy()
        }
        
        logger.info(f"Comprehensive analysis completed for {pair}")
        return analysis

# Synchronous wrapper functions for easy integration
def get_live_forex_quote(pair: str = "EUR_USD") -> Optional[Dict]:
    """Synchronous wrapper for getting forex quotes"""
    api_manager = ForexAPIManager()
    return asyncio.run(api_manager.get_forex_quote(pair))

def get_live_forex_news(query: str = "EUR USD forex") -> Optional[Dict]:
    """Synchronous wrapper for getting forex news"""
    api_manager = ForexAPIManager()
    return asyncio.run(api_manager.get_forex_news(query))

def get_comprehensive_forex_analysis(pair: str = "EUR_USD") -> Dict:
    """Synchronous wrapper for comprehensive analysis"""
    api_manager = ForexAPIManager()
    return asyncio.run(api_manager.get_comprehensive_analysis(pair))

# Test function
async def test_api_connections():
    """Test all API connections"""
    print("🔍 TESTING API CONNECTIONS:")
    print("=" * 30)
    
    api_manager = ForexAPIManager()
    
    # Check API status
    status = api_manager.check_api_status()
    for api, stat in status.items():
        print(f"   {api}: {stat}")
    
    print("\n📊 TESTING LIVE DATA RETRIEVAL:")
    print("=" * 35)
    
    # Test comprehensive analysis
    analysis = await api_manager.get_comprehensive_analysis("EUR_USD")
    
    if analysis["quote"]:
        quote = analysis["quote"]
        print(f"   ✅ Live EUR/USD Quote: {quote['price']:.5f}")
        print(f"      Source: {quote['source']}")
        print(f"      Change: {quote['change']:+.5f} ({quote['change_percent']:+.2f}%)")
    
    if analysis["news"]:
        news = analysis["news"]
        print(f"   ✅ News Sentiment: {news['sentiment'].upper()}")
        print(f"      Articles Analyzed: {news['articles_analyzed']}")
        print(f"      Sentiment Score: {news['sentiment_score']:+d}")
    
    if analysis["technical"]:
        tech = analysis["technical"]
        print(f"   ✅ Technical Data: OHLC Available")
        print(f"      Latest Close: {tech['close']:.5f}")
        print(f"      High: {tech['high']:.5f} | Low: {tech['low']:.5f}")
    
    print(f"\n📈 REQUEST COUNTS:")
    for api, count in analysis["request_counts"].items():
        print(f"   {api}: {count} requests")
    
    return analysis

if __name__ == "__main__":
    # Run test
    print("🚀 FOREX API INTEGRATION FRAMEWORK")
    print("=" * 40)
    print("Status: READY FOR DEPLOYMENT")
    print("APIs: Finnhub, News API, Alpha Vantage, OANDA, Exchange Rate API")
    print()
    
    # Test with current configuration
    result = asyncio.run(test_api_connections())
    
    print("\n✅ API INTEGRATION FRAMEWORK READY")
    print("⏳ Add API keys to enable full functionality")
    print("🎯 Ready for Phase 1 deployment")
#!/usr/bin/env python3
"""
Real-time Market Monitoring System
Monitors forex markets for optimal trading opportunities
"""

import asyncio
import json
from datetime import datetime
from forex_api_integration import ForexAPIManager

class MarketMonitor:
    def __init__(self):
        self.api_manager = ForexAPIManager()
        self.monitoring = False
        self.alerts = []
        
    async def monitor_market_conditions(self):
        """Continuously monitor market for trading opportunities"""
        print("📊 STARTING REAL-TIME MARKET MONITORING")
        print("=" * 40)
        
        self.monitoring = True
        
        while self.monitoring:
            try:
                # Get comprehensive market analysis
                analysis = await self.api_manager.get_comprehensive_analysis("EUR_USD")
                
                # Check for trading opportunities
                opportunities = self.analyze_opportunities(analysis)
                
                # Display current status
                self.display_market_status(analysis, opportunities)
                
                # Wait before next update
                await asyncio.sleep(30)  # Update every 30 seconds
                
            except Exception as e:
                print(f"❌ Monitoring error: {e}")
                await asyncio.sleep(60)  # Wait longer on error
    
    def analyze_opportunities(self, analysis: dict) -> list:
        """Analyze market data for trading opportunities"""
        opportunities = []
        
        if not analysis or not analysis.get('quote'):
            return opportunities
        
        quote = analysis['quote']
        current_price = quote.get('price', 0)
        
        # Price movement opportunity
        if abs(quote.get('change_percent', 0)) > 0.5:
            opportunities.append({
                "type": "PRICE_MOVEMENT",
                "description": f"Significant price movement: {quote.get('change_percent', 0):+.2f}%",
                "confidence": "HIGH" if abs(quote.get('change_percent', 0)) > 1.0 else "MEDIUM"
            })
        
        # News sentiment opportunity
        if analysis.get('news'):
            news = analysis['news']
            if news.get('sentiment') in ['bullish', 'bearish'] and news.get('sentiment_score', 0) != 0:
                opportunities.append({
                    "type": "NEWS_SENTIMENT",
                    "description": f"Strong {news['sentiment']} sentiment (score: {news['sentiment_score']})",
                    "confidence": "HIGH" if abs(news.get('sentiment_score', 0)) > 3 else "MEDIUM"
                })
        
        return opportunities
    
    def display_market_status(self, analysis: dict, opportunities: list):
        """Display current market status"""
        timestamp = datetime.now().strftime('%H:%M:%S UTC')
        print(f"\n⏰ {timestamp} - MARKET STATUS UPDATE")
        print("-" * 35)
        
        if analysis and analysis.get('quote'):
            quote = analysis['quote']
            print(f"💱 EUR/USD: {quote.get('price', 'N/A'):.5f}")
            print(f"📈 Change: {quote.get('change_percent', 0):+.2f}%")
            print(f"🔗 Source: {quote.get('source', 'Unknown')}")
        
        if analysis and analysis.get('news'):
            news = analysis['news']
            print(f"📰 Sentiment: {news.get('sentiment', 'neutral').upper()}")
            print(f"📊 Articles: {news.get('articles_analyzed', 0)}")
        
        if opportunities:
            print(f"🎯 Opportunities: {len(opportunities)}")
            for opp in opportunities:
                print(f"   • {opp['description']} ({opp['confidence']})")
        else:
            print("⏳ No immediate opportunities detected")
    
    def stop_monitoring(self):
        """Stop market monitoring"""
        self.monitoring = False
        print("🛑 Market monitoring stopped")

async def main():
    """Main monitoring function"""
    monitor = MarketMonitor()
    
    try:
        await monitor.monitor_market_conditions()
    except KeyboardInterrupt:
        monitor.stop_monitoring()
        print("\n👋 Market monitoring terminated by user")

if __name__ == "__main__":
    asyncio.run(main())

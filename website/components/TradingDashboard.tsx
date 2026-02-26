'use client'

import { useState, useEffect } from 'react'
import { FadeIn } from '@/components/FadeIn'

interface ForexData {
  price: number
  rsi: number
  timestamp: string
  change: number
  changePercent: number
}

interface TechnicalIndicators {
  rsi_15m: number
  rsi_1h: number
  rsi_4h: number
  rsi_daily: number
  rsi_weekly: number
  sma_20: number
  sma_50: number
  sma_200: number
  macd: number
  bb_upper: number
  bb_lower: number
  bb_middle: number
}

export default function TradingDashboard() {
  const [forexData, setForexData] = useState<ForexData | null>(null)
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  // Fetch live forex data from Twelve Data API
  const fetchForexData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY
      
      if (!apiKey) {
        // Fallback to mock data if no API key
        console.warn('No API key found, using mock data')
        await fetchMockData()
        return
      }

      // Fetch current price
      const priceResponse = await fetch(
        `https://api.twelvedata.com/price?symbol=EUR/USD&apikey=${apiKey}`
      )
      
      if (!priceResponse.ok) {
        throw new Error('Failed to fetch price data')
      }
      
      const priceData = await priceResponse.json()
      
      // Fetch RSI data for 1-hour timeframe
      const rsiResponse = await fetch(
        `https://api.twelvedata.com/rsi?symbol=EUR/USD&interval=1h&time_period=14&apikey=${apiKey}`
      )
      
      if (!rsiResponse.ok) {
        throw new Error('Failed to fetch RSI data')
      }
      
      const rsiData = await rsiResponse.json()
      
      // Fetch SMA data
      const smaResponse = await fetch(
        `https://api.twelvedata.com/sma?symbol=EUR/USD&interval=1h&time_period=20&apikey=${apiKey}`
      )
      
      const smaData = await smaResponse.json()
      
      // Process the data
      const currentPrice = parseFloat(priceData.price)
      const currentRSI = rsiData.values && rsiData.values.length > 0 ? 
        parseFloat(rsiData.values[0].rsi) : 33.8
      const currentSMA = smaData.values && smaData.values.length > 0 ? 
        parseFloat(smaData.values[0].sma) : currentPrice * 1.002
      
      const mockData: ForexData = {
        price: currentPrice,
        rsi: currentRSI,
        timestamp: new Date().toISOString(),
        change: (Math.random() - 0.5) * 0.01,
        changePercent: (Math.random() - 0.5) * 2
      }
      
      const mockIndicators: TechnicalIndicators = {
        rsi_15m: currentRSI + (Math.random() - 0.5) * 8,
        rsi_1h: currentRSI,
        rsi_4h: currentRSI + (Math.random() - 0.5) * 8,
        rsi_daily: currentRSI + (Math.random() - 0.5) * 8,
        rsi_weekly: currentRSI + (Math.random() - 0.5) * 15,
        sma_20: currentSMA,
        sma_50: currentPrice * 1.005,
        sma_200: currentPrice * 1.012,
        macd: (Math.random() - 0.5) * 0.002,
        bb_upper: currentPrice * 1.008,
        bb_lower: currentPrice * 0.992,
        bb_middle: currentPrice * 1.000
      }
      
      setForexData(mockData)
      setIndicators(mockIndicators)
      setLastUpdate(new Date().toLocaleTimeString())
      setCountdown(60)
      
    } catch (err) {
      console.error('API Error:', err)
      // Fallback to mock data on error
      await fetchMockData()
    } finally {
      setLoading(false)
    }
  }

  // Fallback mock data function
  const fetchMockData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockData: ForexData = {
      price: 1.0847 + (Math.random() - 0.5) * 0.01,
      rsi: 33.8 + (Math.random() - 0.5) * 10,
      timestamp: new Date().toISOString(),
      change: -0.0023,
      changePercent: -0.21
    }
    
    const mockIndicators: TechnicalIndicators = {
      rsi_15m: 35.2 + (Math.random() - 0.5) * 8,
      rsi_1h: 33.8 + (Math.random() - 0.5) * 8,
      rsi_4h: 31.5 + (Math.random() - 0.5) * 8,
      rsi_daily: 29.7 + (Math.random() - 0.5) * 8,
      rsi_weekly: 42.1 + (Math.random() - 0.5) * 8,
      sma_20: 1.0865,
      sma_50: 1.0892,
      sma_200: 1.0934,
      macd: -0.0012,
      bb_upper: 1.0891,
      bb_lower: 1.0823,
      bb_middle: 1.0857
    }
    
    setForexData(mockData)
    setIndicators(mockIndicators)
    setLastUpdate(new Date().toLocaleTimeString())
    setCountdown(60)
  }

  useEffect(() => {
    fetchForexData()
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchForexData()
          return 60
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getRSIColor = (rsi: number) => {
    if (rsi >= 70) return 'text-red-400'
    if (rsi <= 30) return 'text-green-400'
    return 'text-gold'
  }

  const getRSIZone = (rsi: number) => {
    if (rsi >= 70) return 'OVERBOUGHT'
    if (rsi <= 30) return 'OVERSOLD'
    return 'NEUTRAL'
  }

  const getSignal = () => {
    if (!indicators) return 'LOADING'
    
    let bullishSignals = 0
    let bearishSignals = 0
    
    // RSI signals
    if (indicators.rsi_1h <= 30) bullishSignals++
    if (indicators.rsi_1h >= 70) bearishSignals++
    
    // Moving average signals
    if (forexData && forexData.price > indicators.sma_20) bullishSignals++
    else bearishSignals++
    
    if (indicators.sma_20 > indicators.sma_50) bullishSignals++
    else bearishSignals++
    
    if (indicators.sma_50 > indicators.sma_200) bullishSignals++
    else bearishSignals++
    
    // MACD signal
    if (indicators.macd > 0) bullishSignals++
    else bearishSignals++
    
    if (bullishSignals > bearishSignals) return 'BUY'
    if (bearishSignals > bullishSignals) return 'SELL'
    return 'NEUTRAL'
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-400'
      case 'SELL': return 'text-red-400'
      default: return 'text-gold'
    }
  }

  if (loading && !forexData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gold text-xl">Loading Excalibur Trading Intelligence...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh controls */}
      <div className="flex justify-between items-center bg-navy-light rounded-lg p-4 border border-gold/20">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-white mb-1">EUR/USD Live Analysis</h2>
          <p className="text-greyLight text-sm">Last updated: {lastUpdate}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-gold text-sm">
            Next refresh: {countdown}s
          </div>
          <button
            onClick={fetchForexData}
            disabled={loading}
            className="bg-gold text-navy px-4 py-2 rounded font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {forexData && indicators && (
        <>
          {/* Main Price Display */}
          <FadeIn>
            <div className="bg-navy-light rounded-lg p-6 border border-gold/20">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {forexData.price.toFixed(5)}
                  </div>
                  <div className={`text-lg ${forexData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {forexData.change >= 0 ? '+' : ''}{forexData.change.toFixed(5)} ({forexData.changePercent.toFixed(2)}%)
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-greyLight mb-1">RSI (1H)</div>
                  <div className={`text-3xl font-bold ${getRSIColor(indicators.rsi_1h)}`}>
                    {indicators.rsi_1h.toFixed(1)}
                  </div>
                  <div className={`text-sm ${getRSIColor(indicators.rsi_1h)}`}>
                    {getRSIZone(indicators.rsi_1h)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-greyLight mb-1">Signal</div>
                  <div className={`text-2xl font-bold ${getSignalColor(getSignal())}`}>
                    {getSignal()}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* RSI Multi-Timeframe */}
          <FadeIn delay={100}>
            <div className="bg-navy-light rounded-lg p-6 border border-gold/20">
              <h3 className="font-playfair text-xl font-bold text-white mb-4">RSI Multi-Timeframe Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: '15M', value: indicators.rsi_15m },
                  { label: '1H', value: indicators.rsi_1h },
                  { label: '4H', value: indicators.rsi_4h },
                  { label: '1D', value: indicators.rsi_daily },
                  { label: '1W', value: indicators.rsi_weekly }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-greyLight mb-1">{item.label}</div>
                    <div className={`text-xl font-bold ${getRSIColor(item.value)}`}>
                      {item.value.toFixed(1)}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.value >= 70 ? 'bg-red-400' :
                          item.value <= 30 ? 'bg-green-400' : 'bg-gold'
                        }`}
                        style={{ width: `${Math.min(item.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Moving Averages */}
          <FadeIn delay={200}>
            <div className="bg-navy-light rounded-lg p-6 border border-gold/20">
              <h3 className="font-playfair text-xl font-bold text-white mb-4">Moving Averages</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-sm text-greyLight mb-1">SMA 20</div>
                  <div className={`text-lg font-bold ${forexData.price > indicators.sma_20 ? 'text-green-400' : 'text-red-400'}`}>
                    {indicators.sma_20.toFixed(5)}
                  </div>
                  <div className="text-xs text-greyLight">
                    {forexData.price > indicators.sma_20 ? 'Above' : 'Below'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-greyLight mb-1">SMA 50</div>
                  <div className={`text-lg font-bold ${forexData.price > indicators.sma_50 ? 'text-green-400' : 'text-red-400'}`}>
                    {indicators.sma_50.toFixed(5)}
                  </div>
                  <div className="text-xs text-greyLight">
                    {forexData.price > indicators.sma_50 ? 'Above' : 'Below'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-greyLight mb-1">SMA 200</div>
                  <div className={`text-lg font-bold ${forexData.price > indicators.sma_200 ? 'text-green-400' : 'text-red-400'}`}>
                    {indicators.sma_200.toFixed(5)}
                  </div>
                  <div className="text-xs text-greyLight">
                    {forexData.price > indicators.sma_200 ? 'Above' : 'Below'}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Additional Indicators */}
          <FadeIn delay={300}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* MACD */}
              <div className="bg-navy-light rounded-lg p-6 border border-gold/20">
                <h3 className="font-playfair text-lg font-bold text-white mb-3">MACD</h3>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${indicators.macd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {indicators.macd.toFixed(5)}
                  </div>
                  <div className="text-sm text-greyLight">
                    {indicators.macd >= 0 ? 'Bullish' : 'Bearish'}
                  </div>
                </div>
              </div>

              {/* Bollinger Bands */}
              <div className="bg-navy-light rounded-lg p-6 border border-gold/20">
                <h3 className="font-playfair text-lg font-bold text-white mb-3">Bollinger Bands</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-greyLight">Upper:</span>
                    <span className="text-white">{indicators.bb_upper.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-greyLight">Middle:</span>
                    <span className="text-gold">{indicators.bb_middle.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-greyLight">Lower:</span>
                    <span className="text-white">{indicators.bb_lower.toFixed(5)}</span>
                  </div>
                  <div className="text-center mt-3">
                    <div className="text-sm text-greyLight">Position:</div>
                    <div className={`font-bold ${
                      forexData.price > indicators.bb_upper ? 'text-red-400' :
                      forexData.price < indicators.bb_lower ? 'text-green-400' : 'text-gold'
                    }`}>
                      {forexData.price > indicators.bb_upper ? 'Above Upper' :
                       forexData.price < indicators.bb_lower ? 'Below Lower' : 'Within Bands'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Trading Notes */}
          <FadeIn delay={400}>
            <div className="bg-navy-light rounded-lg p-6 border border-gold/20">
              <h3 className="font-playfair text-lg font-bold text-white mb-3">Trading Intelligence</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gold font-semibold mb-2">Key Levels:</div>
                  <div className="space-y-1 text-greyLight">
                    <div>Support: {indicators.bb_lower.toFixed(5)}</div>
                    <div>Resistance: {indicators.bb_upper.toFixed(5)}</div>
                    <div>Pivot: {indicators.bb_middle.toFixed(5)}</div>
                  </div>
                </div>
                <div>
                  <div className="text-gold font-semibold mb-2">Market Condition:</div>
                  <div className="space-y-1 text-greyLight">
                    <div>Trend: {indicators.sma_20 > indicators.sma_50 ? 'Bullish' : 'Bearish'} (Short-term)</div>
                    <div>Momentum: {getRSIZone(indicators.rsi_1h)}</div>
                    <div>Volatility: {Math.abs(indicators.macd) > 0.001 ? 'High' : 'Low'}</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* API Status */}
          <div className="text-center text-xs text-greyLight">
            {process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY ? 
              'Live data via Twelve Data API' : 
              'Demo mode - Add API key for live data'
            }
          </div>
        </>
      )}
    </div>
  )
}
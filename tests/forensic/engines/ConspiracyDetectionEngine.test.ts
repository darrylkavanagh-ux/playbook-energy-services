/**
 * ConspiracyDetectionEngine Test Suite
 * 
 * Tests the 5 detection methods:
 * 1. Temporal Correlation Analysis
 * 2. Actor Intersection Analysis
 * 3. Financial Flow Mapping
 * 4. Cui Bono (Who Benefits) Analysis
 * 5. Comprehensive Conspiracy Scoring
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ConspiracyDetectionEngine } from '@server/engines/ConspiracyDetectionEngine';

describe('ConspiracyDetectionEngine', () => {
  let engine: ConspiracyDetectionEngine;
  
  beforeEach(() => {
    engine = new ConspiracyDetectionEngine();
  });
  
  describe('Temporal Correlation Analysis', () => {
    it('should detect suspicious timing patterns in sequential events', async () => {
      const events = [
        { timestamp: new Date('2026-01-01T09:00:00Z'), actor: 'ActorA', action: 'transfer', amount: 50000 },
        { timestamp: new Date('2026-01-01T09:05:00Z'), actor: 'ActorB', action: 'receive', amount: 50000 },
        { timestamp: new Date('2026-01-01T09:10:00Z'), actor: 'ActorC', action: 'convert', amount: 48000 },
      ];
      
      const result = await engine.analyzeTemporalCorrelation(events);
      
      expect(result).toBeDefined();
      expect(result.suspicious).toBe(true);
      expect(result.pattern).toBe('rapid_sequential');
      expect(result.timeWindowMinutes).toBeLessThan(30);
      expect(result.confidence).toBeValidScore();
      expect(result.confidence).toBeGreaterThan(0.7);
    });
    
    it('should not flag normal time gaps as suspicious', async () => {
      const events = [
        { timestamp: new Date('2026-01-01T09:00:00Z'), actor: 'ActorA', action: 'transfer' },
        { timestamp: new Date('2026-01-05T14:00:00Z'), actor: 'ActorB', action: 'receive' },
        { timestamp: new Date('2026-01-15T10:00:00Z'), actor: 'ActorC', action: 'convert' },
      ];
      
      const result = await engine.analyzeTemporalCorrelation(events);
      
      expect(result.suspicious).toBe(false);
      expect(result.confidence).toBeLessThan(0.3);
    });
    
    it('should detect coordinated timing across multiple actors', async () => {
      const events = [
        { timestamp: new Date('2026-01-01T09:00:00Z'), actor: 'A', action: 'initiate' },
        { timestamp: new Date('2026-01-01T09:00:30Z'), actor: 'B', action: 'execute' },
        { timestamp: new Date('2026-01-01T09:01:00Z'), actor: 'C', action: 'confirm' },
        { timestamp: new Date('2026-01-01T09:01:30Z'), actor: 'D', action: 'finalize' },
      ];
      
      const result = await engine.analyzeTemporalCorrelation(events);
      
      expect(result.suspicious).toBe(true);
      expect(result.pattern).toMatch(/coordinated|synchronized/i);
      expect(result.actorCount).toBe(4);
    });
  });
  
  describe('Actor Intersection Analysis', () => {
    it('should identify common actors across multiple transactions', async () => {
      const transactions = [
        { id: 't1', actors: ['Alice', 'Bob', 'Xavier'], amount: 50000 },
        { id: 't2', actors: ['Bob', 'Carol', 'Xavier'], amount: 75000 },
        { id: 't3', actors: ['Carol', 'David', 'Xavier'], amount: 60000 },
        { id: 't4', actors: ['David', 'Eve', 'Xavier'], amount: 45000 },
      ];
      
      const result = await engine.analyzeActorIntersection(transactions);
      
      expect(result.commonActors).toContain('Xavier');
      expect(result.intersectionCount['Xavier']).toBe(4);
      expect(result.suspicionScore).toBeValidScore();
      expect(result.suspicionScore).toBeGreaterThan(0.8);
      expect(result.pattern).toBe('hub_actor');
    });
    
    it('should detect shell company patterns', async () => {
      const transactions = [
        { actors: ['CompanyA', 'Shell1', 'Beneficiary'], type: 'layering' },
        { actors: ['CompanyB', 'Shell1', 'Beneficiary'], type: 'layering' },
        { actors: ['CompanyC', 'Shell2', 'Beneficiary'], type: 'layering' },
        { actors: ['Shell1', 'Shell2', 'Beneficiary'], type: 'integration' },
      ];
      
      const result = await engine.analyzeActorIntersection(transactions);
      
      expect(result.commonActors).toContain('Beneficiary');
      expect(result.shellCompanies).toContain('Shell1');
      expect(result.shellCompanies).toContain('Shell2');
      expect(result.layeringDetected).toBe(true);
    });
    
    it('should handle no common actors correctly', async () => {
      const transactions = [
        { actors: ['Alice', 'Bob'], amount: 1000 },
        { actors: ['Carol', 'David'], amount: 2000 },
        { actors: ['Eve', 'Frank'], amount: 3000 },
      ];
      
      const result = await engine.analyzeActorIntersection(transactions);
      
      expect(result.commonActors.length).toBe(0);
      expect(result.suspicionScore).toBeLessThan(0.2);
    });
  });
  
  describe('Financial Flow Mapping', () => {
    it('should map money flow through multiple entities', async () => {
      const transactions = [
        { from: 'Source', to: 'Shell1', amount: 100000, date: '2026-01-01' },
        { from: 'Shell1', to: 'Shell2', amount: 95000, date: '2026-01-02' },
        { from: 'Shell2', to: 'Shell3', amount: 90000, date: '2026-01-03' },
        { from: 'Shell3', to: 'Beneficiary', amount: 85000, date: '2026-01-04' },
      ];
      
      const result = await engine.mapFinancialFlows(transactions);
      
      expect(result.flowPath).toEqual(['Source', 'Shell1', 'Shell2', 'Shell3', 'Beneficiary']);
      expect(result.totalFlow).toBe(85000); // Final amount
      expect(result.layerCount).toBe(3); // Number of intermediaries
      expect(result.lossPercentage).toBeCloseTo(15, 0); // 15% loss through layers
      expect(result.suspicious).toBe(true);
    });
    
    it('should detect circular money flows', async () => {
      const transactions = [
        { from: 'A', to: 'B', amount: 10000 },
        { from: 'B', to: 'C', amount: 9500 },
        { from: 'C', to: 'A', amount: 9000 },
      ];
      
      const result = await engine.mapFinancialFlows(transactions);
      
      expect(result.circularFlow).toBe(true);
      expect(result.pattern).toBe('round_tripping');
      expect(result.suspicionScore).toBeGreaterThan(0.9);
    });
    
    it('should calculate accurate flow loss percentages', async () => {
      const transactions = [
        { from: 'Start', to: 'Mid', amount: 100000 },
        { from: 'Mid', to: 'End', amount: 70000 },
      ];
      
      const result = await engine.mapFinancialFlows(transactions);
      
      expect(result.lossPercentage).toBe(30);
      expect(result.totalLoss).toBe(30000);
    });
  });
  
  describe('Cui Bono (Who Benefits) Analysis', () => {
    it('should identify ultimate beneficiary in complex flow', async () => {
      const financialGraph = {
        nodes: ['SourceA', 'SourceB', 'Shell1', 'Shell2', 'Shell3', 'Beneficiary'],
        edges: [
          { from: 'SourceA', to: 'Shell1', amount: 100000 },
          { from: 'SourceB', to: 'Shell2', amount: 150000 },
          { from: 'Shell1', to: 'Shell3', amount: 95000 },
          { from: 'Shell2', to: 'Shell3', amount: 140000 },
          { from: 'Shell3', to: 'Beneficiary', amount: 220000 },
        ]
      };
      
      const result = await engine.cuiBono(financialGraph);
      
      expect(result.beneficiary).toBe('Beneficiary');
      expect(result.totalFlow).toBeGreaterThan(200000);
      expect(result.sourceCount).toBe(2);
      expect(result.layerCount).toBeGreaterThanOrEqual(2);
      expect(result.confidence).toBeValidScore();
      expect(result.confidence).toBeGreaterThan(0.85);
    });
    
    it('should detect nominee arrangements', async () => {
      const financialGraph = {
        nodes: ['TrueOwner', 'Nominee', 'Asset'],
        edges: [
          { from: 'TrueOwner', to: 'Nominee', amount: 500000, type: 'loan' },
          { from: 'Nominee', to: 'Asset', amount: 500000, type: 'purchase' },
        ],
        metadata: {
          'Nominee': { type: 'individual', relationship: 'employee' },
          'TrueOwner': { type: 'corporation', control: 'beneficial_owner' }
        }
      };
      
      const result = await engine.cuiBono(financialGraph);
      
      expect(result.beneficiary).toBe('TrueOwner');
      expect(result.nomineeDetected).toBe(true);
      expect(result.arrangement).toBe('nominee_ownership');
    });
  });
  
  describe('Comprehensive Conspiracy Scoring', () => {
    it('should generate multi-factor conspiracy score', async () => {
      const caseData = {
        temporalEvents: [
          { timestamp: '2026-01-01T09:00:00Z', actor: 'A', action: 'initiate' },
          { timestamp: '2026-01-01T09:05:00Z', actor: 'B', action: 'execute' },
          { timestamp: '2026-01-01T09:10:00Z', actor: 'C', action: 'complete' },
        ],
        financialTransactions: [
          { from: 'A', to: 'Shell1', amount: 100000 },
          { from: 'Shell1', to: 'B', amount: 95000 },
          { from: 'B', to: 'C', amount: 90000 },
        ],
        communicationPatterns: [
          { from: 'A', to: 'B', encrypted: true, timestamp: '2026-01-01T08:55:00Z' },
          { from: 'B', to: 'C', encrypted: true, timestamp: '2026-01-01T09:03:00Z' },
        ],
        documentTimeline: [
          { type: 'contract', signed: '2026-01-01T08:00:00Z', parties: ['A', 'B'] },
          { type: 'transfer', executed: '2026-01-01T09:00:00Z', parties: ['B', 'C'] },
        ]
      };
      
      const score = await engine.calculateConspiracyScore(caseData);
      
      expect(score).toHaveProperty('overallScore');
      expect(score).toHaveProperty('temporalScore');
      expect(score).toHaveProperty('financialScore');
      expect(score).toHaveProperty('communicationScore');
      expect(score).toHaveProperty('documentScore');
      expect(score).toHaveProperty('confidence');
      
      expect(score.overallScore).toBeValidScore();
      expect(score.temporalScore).toBeValidScore();
      expect(score.financialScore).toBeValidScore();
      expect(score.communicationScore).toBeValidScore();
      expect(score.documentScore).toBeValidScore();
      expect(score.confidence).toBeValidScore();
      
      // High coordination should result in high conspiracy score
      expect(score.overallScore).toBeGreaterThan(0.7);
    });
    
    it('should provide detailed findings with evidence', async () => {
      const caseData = {
        temporalEvents: [],
        financialTransactions: [],
        communicationPatterns: [],
        documentTimeline: []
      };
      
      const score = await engine.calculateConspiracyScore(caseData);
      
      expect(score).toHaveProperty('findings');
      expect(Array.isArray(score.findings)).toBe(true);
      expect(score.findings.length).toBeGreaterThan(0);
      
      score.findings.forEach((finding: any) => {
        expect(finding).toHaveProperty('category');
        expect(finding).toHaveProperty('description');
        expect(finding).toHaveProperty('evidence');
        expect(finding).toHaveProperty('severity');
      });
    });
    
    it('should handle low-conspiracy cases correctly', async () => {
      const normalCaseData = {
        temporalEvents: [
          { timestamp: '2026-01-01T09:00:00Z', actor: 'A', action: 'payment' },
          { timestamp: '2026-01-15T14:00:00Z', actor: 'B', action: 'receive' },
        ],
        financialTransactions: [
          { from: 'A', to: 'B', amount: 5000 }, // Normal business transaction
        ],
        communicationPatterns: [],
        documentTimeline: []
      };
      
      const score = await engine.calculateConspiracyScore(normalCaseData);
      
      expect(score.overallScore).toBeLessThan(0.3);
      expect(score.confidence).toBeGreaterThan(0.5); // Confident it's NOT a conspiracy
    });
  });
  
  describe('Edge Cases and Error Handling', () => {
    it('should handle empty input gracefully', async () => {
      const result = await engine.analyzeTemporalCorrelation([]);
      
      expect(result).toBeDefined();
      expect(result.suspicious).toBe(false);
      expect(result.confidence).toBe(0);
    });
    
    it('should handle single event input', async () => {
      const events = [{ timestamp: new Date(), actor: 'A', action: 'test' }];
      
      const result = await engine.analyzeTemporalCorrelation(events);
      
      expect(result.suspicious).toBe(false);
      expect(result.pattern).toBe('insufficient_data');
    });
    
    it('should validate input data types', async () => {
      await expect(
        engine.analyzeTemporalCorrelation(null as any)
      ).rejects.toThrow('Invalid input');
    });
  });
  
  describe('Performance', () => {
    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        timestamp: new Date(2026, 0, 1, 9, i % 60, i % 60),
        actor: `Actor${i % 50}`,
        action: 'transaction'
      }));
      
      const startTime = Date.now();
      const result = await engine.analyzeTemporalCorrelation(largeDataset);
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
      expect(result).toBeDefined();
    });
  });
});

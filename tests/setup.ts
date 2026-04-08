import { expect, afterEach, beforeAll, afterAll } from 'vitest';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/orb_ai_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Global test setup
beforeAll(() => {
  console.log('🧪 ORB AI Test Suite Starting...');
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

afterAll(() => {
  console.log('✅ ORB AI Test Suite Complete');
});

// Cleanup after each test
afterEach(() => {
  // Reset any test state if needed
});

// Extend expect with custom matchers
expect.extend({
  toBeValidScore(received: number) {
    const pass = received >= 0 && received <= 1;
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a valid score (0-1)`
        : `Expected ${received} to be a valid score (0-1)`
    };
  },
  toBeValidHash(received: string) {
    const pass = /^[a-f0-9]{64}$/.test(received); // SHA-256 hash
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a valid SHA-256 hash`
        : `Expected ${received} to be a valid SHA-256 hash`
    };
  },
  toHaveChainOfCustody(received: any) {
    const pass = Array.isArray(received.chainOfCustody) && 
                 received.chainOfCustody.every((entry: any) => 
                   entry.timestamp && entry.handler && entry.action
                 );
    return {
      pass,
      message: () => pass
        ? `Expected not to have valid chain of custody`
        : `Expected to have valid chain of custody with timestamp, handler, and action`
    };
  }
});

// Declare custom matchers for TypeScript
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeValidScore(): T;
    toBeValidHash(): T;
    toHaveChainOfCustody(): T;
  }
}

export {};

/**
 * Testing utilities
 * Provides helper functions for testing
 */

export interface MockResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

/**
 * Create a mock fetch response
 */
export function createMockResponse<T>(data: T, status: number = 200): MockResponse<T> {
  return {
    data,
    status,
    ok: status >= 200 && status < 300,
  };
}

/**
 * Wait for a specified amount of time (useful for testing async operations)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a mock stream
 */
export function createMockStream(overrides: Partial<any> = {}): any {
  return {
    id: `stream_${Date.now()}`,
    sender: 'G' + 'A'.repeat(55),
    recipient: 'G' + 'B'.repeat(55),
    ratePerSecond: 0.001,
    startTime: Math.floor(Date.now() / 1000),
    paused: false,
    ...overrides,
  };
}

/**
 * Create a mock user
 */
export function createMockUser(overrides: Partial<any> = {}): any {
  return {
    id: `user_${Date.now()}`,
    email: 'test@example.com',
    name: 'Test User',
    address: 'G' + 'A'.repeat(55),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock transaction
 */
export function createMockTransaction(overrides: Partial<any> = {}): any {
  return {
    id: `tx_${Date.now()}`,
    streamId: `stream_${Date.now()}`,
    amount: 100,
    timestamp: new Date().toISOString(),
    type: 'withdrawal',
    status: 'completed',
    ...overrides,
  };
}

/**
 * Assert that a condition is true
 */
export function assert(condition: boolean, message: string = 'Assertion failed'): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Assert that two values are equal
 */
export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

/**
 * Assert that a value is not null or undefined
 */
export function assertNotNull<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || 'Value is null or undefined');
  }
}

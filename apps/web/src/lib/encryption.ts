/**
 * Encryption utilities for sensitive data
 * Provides encryption/decryption for secure data storage
 */

/**
 * Simple XOR encryption for demo purposes
 * In production, use proper encryption libraries like crypto-js or Web Crypto API
 */
export function encrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

/**
 * Simple XOR decryption for demo purposes
 * In production, use proper encryption libraries like crypto-js or Web Crypto API
 */
export function decrypt(encrypted: string, key: string): string {
  const text = atob(encrypted);
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

/**
 * Generate a random encryption key
 */
export function generateEncryptionKey(): string {
  const array = new Uint32Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(16)).join('');
}

/**
 * Hash a string using SHA-256
 */
export async function hashString(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

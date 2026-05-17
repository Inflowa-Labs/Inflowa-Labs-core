/**
 * Secure storage utilities
 * Provides secure local storage with encryption
 */

import { encrypt, decrypt, generateEncryptionKey } from './encryption';

const STORAGE_KEY = 'inflowa_secure_storage';
const ENCRYPTION_KEY = 'inflowa_default_key'; // In production, use user-specific key

export interface SecureStorageData {
  [key: string]: any;
}

class SecureStorage {
  private getKey(): string {
    let key = localStorage.getItem(STORAGE_KEY);
    if (!key) {
      key = generateEncryptionKey();
      localStorage.setItem(STORAGE_KEY, key);
    }
    return key;
  }

  setItem(key: string, value: any): void {
    try {
      const storageKey = this.getKey();
      const encrypted = encrypt(JSON.stringify(value), storageKey);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to securely store item:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const storageKey = this.getKey();
      const decrypted = decrypt(encrypted, storageKey);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

export const secureStorage = new SecureStorage();

/**
 * Session storage for temporary data
 */
export const sessionStorage = {
  setItem(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to store session item:', error);
    }
  },

  getItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (error) {
      console.error('Failed to retrieve session item:', error);
      return null;
    }
  },

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  },

  clear(): void {
    sessionStorage.clear();
  }
};

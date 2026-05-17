/**
 * Authentication utilities
 * Provides authentication and session management
 */

export interface AuthUser {
  id: string;
  email: string;
  address: string;
  token: string;
}

export interface AuthSession {
  user: AuthUser;
  expiresAt: number;
}

class AuthService {
  private sessionKey = 'auth_session';
  private tokenKey = 'auth_token';

  /**
   * Authenticate user with credentials
   */
  async authenticate(email: string, password: string): Promise<AuthSession | null> {
    // In production, this would call an API
    // For demo, we'll use mock authentication
    if (email && password) {
      const session: AuthSession = {
        user: {
          id: 'user_' + Date.now(),
          email,
          address: '',
          token: this.generateToken(),
        },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      this.setSession(session);
      return session;
    }
    return null;
  }

  /**
   * Authenticate with Stellar wallet
   */
  async authenticateWithWallet(address: string): Promise<AuthSession | null> {
    if (address && address.startsWith('G')) {
      const session: AuthSession = {
        user: {
          id: 'user_' + Date.now(),
          email: '',
          address,
          token: this.generateToken(),
        },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      this.setSession(session);
      return session;
    }
    return null;
  }

  /**
   * Get current session
   */
  getSession(): AuthSession | null {
    try {
      const sessionStr = localStorage.getItem(this.sessionKey);
      if (!sessionStr) return null;

      const session: AuthSession = JSON.parse(sessionStr);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  /**
   * Set session
   */
  private setSession(session: AuthSession): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    localStorage.setItem(this.tokenKey, session.user.token);
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Generate authentication token
   */
  private generateToken(): string {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(16)).join('');
  }

  /**
   * Refresh session
   */
  refreshSession(): boolean {
    const session = this.getSession();
    if (session) {
      session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      this.setSession(session);
      return true;
    }
    return false;
  }
}

export const authService = new AuthService();

import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';
import { decode } from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {}

  // Function to generate JWT token
  generateToken(payload: any): string {
    return jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' }); // Change 'your_secret_key' to a strong, secret key
  }

  // Function to save token in local storage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Function to retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Function to remove token from local storage
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Function to check if token is expired
  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwt.decode(token);
    if (!decodedToken) return true;
    return Date.now() >= decodedToken.exp * 1000;
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';


function decodeToken(token: string): any {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private authState$ = new BehaviorSubject<boolean>(this.hasToken());
  private nameKey = 'username';

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = decodeToken(token);
      if (!decoded.exp) return true;
      const now = Date.now() / 1000;
      return decoded.exp < now;
    } catch {
      return true;
    }
  }

  private usernameSubject = new BehaviorSubject<string | null>(this.getStoredUsername());
  username$ = this.usernameSubject.asObservable();

  private getStoredUsername(): string | null {
    return localStorage.getItem(this.nameKey);
  }


  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getAuthState(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  getUserId(): number {
    const token = this.getToken();
    if (!token) return 0;
    try {
      const decoded: any = decodeToken(token);
      return parseInt(decoded.nameid || decoded.sub || '0');
    } catch {
      return 0;
    }
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('https://localhost:7183/api/Auth/sign_in', { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem(this.tokenKey, res.token);

          const decoded = decodeToken(res.token);
          const name = decoded.fname || decoded.name || decoded.sub || 'User';
          localStorage.setItem(this.nameKey, name);
          this.usernameSubject.next(name);
          this.authState$.next(true);
        })
      );
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.nameKey);
    this.usernameSubject.next(null);
    this.authState$.next(false);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }
  getUsername(): string | null {
    return localStorage.getItem(this.nameKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post('https://localhost:7183/api/Auth/forgot_password', { email });
  }


  resetPassword(data: { email: string; token: string; newPassword: string }) {
    return this.http.post<boolean>(
      'https://localhost:7183/api/Auth/reset_password',
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getProfile(): Observable<any> {
    return this.http.get('https://localhost:7183/api/Users/me', this.getAuthHeaders());
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put('https://localhost:7183/api/Users/update', data, this.getAuthHeaders());
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decoded: any = decodeToken(token);
      return decoded.role || '';
    } catch {
      return '';
    }
  }

}

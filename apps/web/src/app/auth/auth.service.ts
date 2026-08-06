import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type PublicUser = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = {
  success: boolean;
  data: {
    user: PublicUser;
    accessToken: string;
  };
};

type MeResponse = {
  success: boolean;
  data: PublicUser;
};

const TOKEN_KEY = 'futureflow_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiBaseUrl;
  readonly currentUser = signal<PublicUser | null>(null);

  constructor(private readonly http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/register`, { email, password })
      .pipe(tap((res) => this.persistSession(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, { email, password })
      .pipe(tap((res) => this.persistSession(res)));
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.api}/users/me`).pipe(
      tap((res) => {
        if (res.success) {
          this.currentUser.set(res.data);
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
  }

  private persistSession(res: AuthResponse): void {
    if (res.success) {
      localStorage.setItem(TOKEN_KEY, res.data.accessToken);
      this.currentUser.set(res.data.user);
    }
  }
}

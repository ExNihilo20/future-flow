import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, PublicUser } from './auth.service';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <mat-card class="auth-card">
      <mat-card-header>
        <mat-card-title>Signed in</mat-card-title>
        <mat-card-subtitle>FutureFlow</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        @if (error()) {
          <p class="error">{{ error() }}</p>
          <a routerLink="/login">Log in</a>
        } @else if (user()) {
          <p>Signed in as <strong>{{ user()!.email }}</strong></p>
          <p class="muted">User ID: {{ user()!.id }}</p>
        } @else {
          <p>Loading…</p>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-stroked-button type="button" (click)="logout()">Log out</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .auth-card { max-width: 480px; margin: 3rem auto; padding: 1rem; }
    .error { color: #b00020; }
    .muted { color: #666; font-size: 0.9rem; }
  `,
})
export class MeComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = signal<PublicUser | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.auth.token) {
      void this.router.navigateByUrl('/login');
      return;
    }
    this.auth.me().subscribe({
      next: (res) => this.user.set(res.data),
      error: () => {
        this.error.set('Session expired or unauthorized');
        this.auth.logout();
      },
    });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}

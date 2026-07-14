import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <mat-card class="auth-card">
      <mat-card-header>
        <mat-card-title>Create account</mat-card-title>
        <mat-card-subtitle>FutureFlow</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" />
          </mat-form-field>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            Register
          </button>
        </form>
      </mat-card-content>
      <mat-card-actions>
        <a routerLink="/login">Already have an account? Log in</a>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .auth-card { max-width: 420px; margin: 3rem auto; padding: 1rem; }
    .full { width: 100%; display: block; }
    .error { color: #b00020; }
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.auth.register(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl('/me');
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Registration failed');
      },
    });
  }
}

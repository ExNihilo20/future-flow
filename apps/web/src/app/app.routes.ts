import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register.component';
import { LoginComponent } from './auth/login.component';
import { MeComponent } from './auth/me.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'me', component: MeComponent },
  { path: '**', redirectTo: 'login' },
];

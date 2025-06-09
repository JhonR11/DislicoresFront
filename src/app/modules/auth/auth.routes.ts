import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./pages/login/login'),
  },
  {
    path: 'register',
    title: 'Register',
    loadComponent: () => import('./pages/register/register'),
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password',
    loadComponent: () => import('./pages/forgot-password/forgot-password'),
  },
] as Routes;

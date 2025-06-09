import { Routes } from '@angular/router';
import { Auth } from '../auth/service/auth';

export default [
  {
    path: '',
    loadComponent: () => import('./layout/layout'),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard'),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products').then((m)=>m.default),
      },
      {
        path: 'noti',
        loadComponent: () => import('./features/notificaciones/notificaciones')
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      }
    ],
  },
] as Routes;

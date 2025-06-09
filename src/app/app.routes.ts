import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.routes') },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.routes') },
  {
    path: 'not-found',
    title: 'Not Found',
    loadComponent: () => import('./shared/pages/not-found/not-found'),
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];

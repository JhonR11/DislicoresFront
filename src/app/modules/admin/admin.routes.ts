import { Routes } from '@angular/router'; 

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
        loadComponent: () => import('./features/products/products'),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/create-users/create-users'),
      },{
        path: 'sales',
        loadComponent: () => import('./features/create-sale/create-sale'),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      }
    ],
  },
] as Routes;

import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

const authGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

const adminGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated() && authService.hasRole('admin')) {
    return true;
  }
  
  router.navigate(['/unauthorized']);
  return false;
};

const loggedOutGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/orders']);
  return false;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => 
      import('./features/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard],
    data: {
      title: 'Gestión de Pedidos',
      description: 'Visualización y gestión de pedidos en tiempo real',
      animation: 'OrdersPage'
    }
  },
  {
    path: 'orders/:id',
    loadComponent: () => 
      import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard],
    data: {
      title: 'Detalle del Pedido',
      description: 'Información detallada de un pedido específico',
      animation: 'OrderDetailPage'
    }
  },
  {
    path: 'analytics',
    loadComponent: () => 
      import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [adminGuard],
    data: {
      title: 'Análisis de Pedidos',
      description: 'Dashboard de análisis y métricas de pedidos',
      animation: 'AnalyticsPage'
    }
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [loggedOutGuard],
    data: {
      title: 'Iniciar Sesión',
      description: 'Autenticación de usuario',
      animation: 'LoginPage'
    }
  },
  {
    path: 'unauthorized',
    loadComponent: () => 
      import('./features/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    data: {
      title: 'Acceso Denegado',
      description: 'Página de acceso no autorizado',
      animation: 'UnauthorizedPage'
    }
  },
  {
    path: 'not-found',
    loadComponent: () => 
      import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: {
      title: 'Página No Encontrada',
      description: 'Recurso no encontrado',
      animation: 'NotFoundPage'
    }
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
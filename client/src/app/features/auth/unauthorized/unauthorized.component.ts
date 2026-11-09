import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface UnauthorizedAction {
  label: string;
  route: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  private readonly router = inject(Router);
  
  readonly pageTitle = 'Acceso Denegado';
  readonly pageSubtitle = 'No tienes los permisos necesarios para acceder a esta sección';
  readonly errorCode = 403;
  readonly timestamp = new Date().toISOString();
  
  readonly availableActions: UnauthorizedAction[] = [
    {
      label: 'Volver al Inicio',
      route: '/orders',
      icon: 'home',
      description: 'Regresa a la página principal de órdenes'
    },
    {
      label: 'Ver mis Órdenes',
      route: '/orders',
      icon: 'shopping_cart',
      description: 'Accede a tus órdenes personalizadas'
    },
    {
      label: 'Cerrar Sesión',
      route: '/login',
      icon: 'logout',
      description: 'Inicia sesión con otras credenciales'
    }
  ];
  
  navigateTo(route: string): void {
    if (route === '/login') {
      this.clearAuthData();
    }
    this.router.navigate([route]);
  }
  
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_role');
  }
  
  refreshPage(): void {
    window.location.reload();
  }
  
  getErrorDetails(): string {
    return `Error ${this.errorCode}: Forbidden - You do not have permission to access this resource.`;
  }
  
  contactSupport(): void {
    const supportEmail = 'soporte@ecommerce.com';
    const subject = encodeURIComponent('Acceso denegado - Solicitud de permisos');
    const body = encodeURIComponent(
      `He intentado acceder a una sección restringida y recibí un error de acceso denegado.\n\n` +
      `Timestamp: ${this.timestamp}\n` +
      `Error: ${this.getErrorDetails()}`
    );
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  }
}
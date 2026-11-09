import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';
import { OrderStatusComponent } from '../../shared/components/order-status/order-status.component';

interface AnalyticsMetric {
  label: string;
  value: number;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface ChartDataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OrderStatusComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private readonly orderService = inject(OrderService);
  
  readonly isLoading = signal<boolean>(true);
  readonly lastUpdated = signal<Date | null>(null);
  readonly refreshInterval = signal<ReturnType<typeof setInterval> | null>(null);
  
  readonly totalOrders = computed<number>(() => {
    return this.orderService.orders().length;
  });
  
  readonly pendingOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'pending').length;
  });
  
  readonly processingOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'processing').length;
  });
  
  readonly deliveredOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'delivered').length;
  });
  
  readonly cancelledOrders = computed<number>(() => {
    return this.orderService.orders().filter(o => o.status === 'cancelled').length;
  });
  
  readonly metrics = computed<AnalyticsMetric[]>(() => [
    {
      label: 'Total de Órdenes',
      value: this.totalOrders(),
      icon: 'shopping_cart',
      color: '#1976d2',
      trend: 'up'
    },
    {
      label: 'Pendientes',
      value: this.pendingOrders(),
      icon: 'hourglass_empty',
      color: '#ff9800'
    },
    {
      label: 'En Proceso',
      value: this.processingOrders(),
      icon: 'sync',
      color: '#2196f3'
    },
    {
      label: 'Entregadas',
      value: this.deliveredOrders(),
      icon: 'check_circle',
      color: '#4caf50',
      trend: 'up'
    },
    {
      label: 'Canceladas',
      value: this.cancelledOrders(),
      icon: 'cancel',
      color: '#f44336'
    }
  ]);
  
  readonly ordersByStatus = computed<ChartDataPoint[]>(() => {
    const orders = this.orderService.orders();
    const statusCounts = new Map<string, number>();
    
    orders.forEach(order => {
      const current = statusCounts.get(order.status) || 0;
      statusCounts.set(order.status, current + 1);
    });
    
    return Array.from(statusCounts.entries()).map(([label, value]) => ({
      label: this.formatStatusLabel(label),
      value
    }));
  });
  
  readonly recentOrders = computed<Order[]>(() => {
    return [...this.orderService.orders()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  });
  
  readonly averageProcessingTime = computed<number>(() => {
    const delivered = this.orderService.orders().filter(o => o.status === 'delivered');
    if (delivered.length === 0) return 0;
    
    const totalTime = delivered.reduce((sum, order) => {
      const created = new Date(order.createdAt).getTime();
      const updated = new Date(order.updatedAt).getTime();
      return sum + (updated - created);
    }, 0);
    
    return Math.round(totalTime / delivered.length / 60000);
  });
  
  ngOnInit(): void {
    this.loadAnalyticsData();
    this.startAutoRefresh();
  }
  
  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }
  
  private loadAnalyticsData(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.lastUpdated.set(new Date());
      this.isLoading.set(false);
    }, 500);
  }
  
  private startAutoRefresh(): void {
    const interval = setInterval(() => {
      this.loadAnalyticsData();
    }, 30000);
    this.refreshInterval.set(interval);
  }
  
  private stopAutoRefresh(): void {
    const interval = this.refreshInterval();
    if (interval) {
      clearInterval(interval);
      this.refreshInterval.set(null);
    }
  }
  
  refreshData(): void {
    this.loadAnalyticsData();
  }
  
  private formatStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'En Proceso',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado'
    };
    return labels[status] || status;
  }
  
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
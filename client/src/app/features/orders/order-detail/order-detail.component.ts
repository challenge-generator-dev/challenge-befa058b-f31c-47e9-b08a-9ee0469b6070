import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderEvent } from '../../../core/models/order.model';
import { OrderStatusComponent } from '../../../shared/components/order-status/order-status.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    OrderStatusComponent
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private destroy$ = new Subject<void>();

  orderId = signal<string>('');
  order = signal<Order | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string>('');
  orderTimeline = signal<OrderEvent[]>([]);

  readonly hasOrder = computed(() => this.order() !== null);
  readonly pageTitle = computed(() => `Pedido ${this.orderId()}`);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId.set(id);
      this.loadOrder(id);
    } else {
      this.error.set('ID de pedido no proporcionado');
      this.isLoading.set(false);
    }

    this.orderService.orders
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        const found = orders.find(o => o.id === this.orderId());
        if (found) {
          this.order.set(found);
          this.isLoading.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrder(id: string): void {
    const existingOrder = this.orderService.orders().find(o => o.id === id);
    if (existingOrder) {
      this.order.set(existingOrder);
      this.isLoading.set(false);
    } else {
      setTimeout(() => {
        if (!this.order()) {
          this.error.set('Pedido no encontrado');
          this.isLoading.set(false);
        }
      }, 2000);
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  refreshOrder(): void {
    const id = this.orderId();
    if (id) {
      this.isLoading.set(true);
      this.error.set('');
      this.loadOrder(id);
    }
  }

  getStatusClass(): string {
    const status = this.order()?.status;
    if (!status) return '';
    
    const statusClasses: Record<string, string> = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded'
    };
    return statusClasses[status] || '';
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}
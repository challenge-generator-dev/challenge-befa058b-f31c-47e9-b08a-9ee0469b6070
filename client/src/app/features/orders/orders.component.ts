import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../core/services/order.service';
import { OrderCardComponent } from '../../shared/components/order-card/order-card.component';
import { OrderStatusComponent } from '../../shared/components/order-status/order-status.component';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    OrderCardComponent,
    OrderStatusComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  
  readonly orders = this.orderService.orders;
  
  newOrder = {
    productId: '',
    quantity: 1,
    customerId: ''
  };
  
  isCreatingOrder = false;
  errorMessage = '';
  showError = false;
  
  ngOnInit(): void {
    this.orderService.setupOrderStream();
  }
  
  ngOnDestroy(): void {
    this.orderService.ngOnDestroy();
  }
  
  async createOrder(): Promise<void> {
    if (!this.validateOrderInput()) {
      return;
    }
    
    this.isCreatingOrder = true;
    this.hideError();
    
    try {
      await this.orderService.createOrder({
        productId: this.newOrder.productId,
        quantity: this.newOrder.quantity,
        customerId: this.newOrder.customerId
      });
      
      this.resetForm();
    } catch (error) {
      this.displayError('Error al crear la orden. Intente de nuevo.');
    } finally {
      this.isCreatingOrder = false;
    }
  }
  
  private validateOrderInput(): boolean {
    if (!this.newOrder.productId || this.newOrder.productId.trim() === '') {
      this.displayError('El ID del producto es requerido');
      return false;
    }
    
    if (!this.newOrder.customerId || this.newOrder.customerId.trim() === '') {
      this.displayError('El ID del cliente es requerido');
      return false;
    }
    
    if (this.newOrder.quantity < 1) {
      this.displayError('La cantidad debe ser mayor a 0');
      return false;
    }
    
    return true;
  }
  
  private resetForm(): void {
    this.newOrder = {
      productId: '',
      quantity: 1,
      customerId: ''
    };
  }
  
  private displayError(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }
  
  private hideError(): void {
    this.showError = false;
    this.errorMessage = '';
  }
  
  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
  
  get ordersList(): Order[] {
    return this.orders();
  }
  
  get hasOrders(): boolean {
    return this.ordersList.length > 0;
  }
}
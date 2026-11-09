import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../../../core/models/order.model';
import { OrderStatusComponent } from '../order-status/order-status.component';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    OrderStatusComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="order-card">
      <mat-card-header>
        <mat-card-title>Order #{{ order.id }}</mat-card-title>
        <mat-card-subtitle>{{ order.customerId }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="order-details">
          <div class="detail-row">
            <span class="label">Product:</span>
            <span class="value">{{ order.productId }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Quantity:</span>
            <span class="value quantity-badge">{{ order.quantity }}</span>
          </div>
          
          <div class="detail-row" *ngIf="order.total">
            <span class="label">Total:</span>
            <span class="value price">{{ order.total | currency }}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Status:</span>
            <app-order-status [status]="order.status"></app-order-status>
          </div>
          
          <div class="detail-row" *ngIf="order.createdAt">
            <span class="label">Created:</span>
            <span class="value">{{ order.createdAt | date:'medium' }}</span>
          </div>
          
          <div class="detail-row" *ngIf="order.updatedAt">
            <span class="label">Updated:</span>
            <span class="value">{{ order.updatedAt | date:'medium' }}</span>
          </div>
        </div>
        
        <mat-chip-set class="status-chips" *ngIf="order.tags?.length">
          <mat-chip *ngFor="let tag of order.tags" class="tag-chip">
            <mat-icon class="chip-icon">{{ getTagIcon(tag) }}</mat-icon>
            {{ tag }}
          </mat-chip>
        </mat-chip-set>
      </mat-card-content>
      
      <mat-card-actions align="end">
        <button mat-button color="primary" (click)="onViewDetails()">
          <mat-icon>visibility</mat-icon>
          View Details
        </button>
        <button mat-button color="accent" (click)="onTrackOrder()">
          <mat-icon>local_shipping</mat-icon>
          Track
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .order-card {
      margin: 16px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .order-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .order-card mat-card-header {
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      color: white;
      padding: 16px;
      margin: -16px -16px 16px -16px;
    }
    
    .order-card mat-card-title {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .order-card mat-card-subtitle {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .order-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .detail-row:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 500;
      color: #666;
      font-size: 0.875rem;
    }
    
    .value {
      font-weight: 600;
      color: #333;
    }
    
    .quantity-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-weight: 700;
    }
    
    .price {
      color: #2e7d32;
      font-size: 1.1rem;
    }
    
    .status-chips {
      margin-top: 16px;
    }
    
    .tag-chip {
      font-size: 0.75rem;
    }
    
    .chip-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    
    mat-card-actions button {
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    mat-card-actions mat-icon {
      margin-right: 4px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
  @Input() showActions: boolean = true;

  getTagIcon(tag: string): string {
    const iconMap: Record<string, string> = {
      'urgent': 'priority_high',
      'new': 'fiber_new',
      'processing': 'sync',
      'shipped': 'local_shipping',
      'delivered': 'check_circle',
      'cancelled': 'cancel'
    };
    return iconMap[tag.toLowerCase()] || 'label';
  }

  onViewDetails(): void {
    console.log('View order details:', this.order.id);
  }

  onTrackOrder(): void {
    console.log('Track order:', this.order.id);
  }
}
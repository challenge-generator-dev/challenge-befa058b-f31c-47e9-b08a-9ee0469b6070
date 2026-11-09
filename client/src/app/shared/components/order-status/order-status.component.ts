import { Component, Input, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

type OrderStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  animation: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="status-container" [class]="statusClass()">
      <div class="status-indicator" [class]="animationClass()">
        <mat-icon class="status-icon">{{ currentConfig().icon }}</mat-icon>
      </div>
      <span class="status-label">{{ currentConfig().label }}</span>
    </div>
  `,
  styles: [`
    .status-container {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
    }
    
    .status-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .status-label {
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Status: Pending */
    .status-pending {
      background: #fff3e0;
      color: #e65100;
      border: 1px solid #ffb74d;
    }
    
    .status-pending .status-indicator {
      background: #ffe0b2;
    }
    
    .status-pending .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    /* Status: Processing */
    .status-processing {
      background: #e3f2fd;
      color: #1565c0;
      border: 1px solid #64b5f6;
    }
    
    .status-processing .status-indicator {
      background: #bbdefb;
    }
    
    .status-processing .animate-spin {
      animation: spin 1.5s linear infinite;
    }
    
    /* Status: Shipped */
    .status-shipped {
      background: #f3e5f5;
      color: #7b1fa2;
      border: 1px solid #ba68c8;
    }
    
    .status-shipped .status-indicator {
      background: #e1bee7;
    }
    
    .status-shipped .animate-bounce {
      animation: bounce 1s ease-in-out infinite;
    }
    
    /* Status: Delivered */
    .status-delivered {
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #81c784;
    }
    
    .status-delivered .status-indicator {
      background: #c8e6c9;
    }
    
    .status-delivered .animate-scale {
      animation: scale 0.5s ease-out;
    }
    
    /* Status: Cancelled */
    .status-cancelled {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
    
    .status-cancelled .status-indicator {
      background: #ffcdd2;
    }
    
    .status-cancelled .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    /* Status: Refunded */
    .status-refunded {
      background: #fce4ec;
      color: #ad1457;
      border: 1px solid #f48fb1;
    }
    
    .status-refunded .status-indicator {
      background: #f8bbd9;
    }
    
    .status-refunded .animate-fade {
      animation: fade 1s ease-in-out;
    }
    
    /* Animations */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    
    @keyframes scale {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    
    @keyframes fade {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
    }
  `]
})
export class OrderStatusComponent {
  private readonly status = signal<OrderStatusType>('pending');
  
  private readonly statusConfigs: Record<OrderStatusType, StatusConfig> = {
    pending: {
      label: 'Pending',
      color: '#e65100',
      bgColor: '#fff3e0',
      icon: 'schedule',
      animation: 'animate-pulse'
    },
    processing: {
      label: 'Processing',
      color: '#1565c0',
      bgColor: '#e3f2fd',
      icon: 'sync',
      animation: 'animate-spin'
    },
    shipped: {
      label: 'Shipped',
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
      icon: 'local_shipping',
      animation: 'animate-bounce'
    },
    delivered: {
      label: 'Delivered',
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      icon: 'check_circle',
      animation: 'animate-scale'
    },
    cancelled: {
      label: 'Cancelled',
      color: '#c62828',
      bgColor: '#ffebee',
      icon: 'cancel',
      animation: 'animate-shake'
    },
    refunded: {
      label: 'Refunded',
      color: '#ad1457',
      bgColor: '#fce4ec',
      icon: 'replay',
      animation: 'animate-fade'
    }
  };

  @Input()
  set status(value: string) {
    const normalizedStatus = this.normalizeStatus(value);
    this.status.set(normalizedStatus);
  }

  readonly currentConfig = computed(() => {
    return this.statusConfigs[this.status()];
  });

  readonly statusClass = computed(() => {
    return `status-${this.status()}`;
  });

  readonly animationClass = computed(() => {
    return this.currentConfig().animation;
  });

  private normalizeStatus(value: string): OrderStatusType {
    const normalized = value?.toLowerCase().trim() as OrderStatusType;
    const validStatuses: OrderStatusType[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    return validStatuses.includes(normalized) ? normalized : 'pending';
  }
}
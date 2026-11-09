import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <mat-icon>shopping_cart</mat-icon>
          <span>Orders</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/orders" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt_long</mat-icon>
            <span matListItemTitle>Pedidos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      display: flex;
    }
    .sidenav {
      width: 240px;
      background: #1a1a2e;
      border-right: 1px solid #16213e;
    }
    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 1px solid #16213e;
    }
    .sidenav-header mat-icon {
      color: #e94560;
    }
    .toolbar {
      background: #1a1a2e;
      color: #fff;
      border-bottom: 1px solid #16213e;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 24px;
      background: #0f0f1a;
      min-height: calc(100vh - 64px);
    }
    .active {
      background: rgba(233, 69, 96, 0.15);
      border-left: 3px solid #e94560;
    }
  `]
})
export class AppComponent {
  sidenavOpened = true;

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
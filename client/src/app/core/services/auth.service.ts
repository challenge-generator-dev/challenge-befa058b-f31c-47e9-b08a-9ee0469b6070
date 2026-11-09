import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  id: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly currentUserRoles = computed(() => this.currentUser()?.roles ?? []);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(email: string, password: string): boolean {
    if (email && password.length >= 4) {
      const user: User = {
        id: crypto.randomUUID(),
        email,
        roles: ['user']
      };
      
      if (email.includes('admin')) {
        user.roles.push('admin');
      }
      
      this.currentUser.set(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.currentUserRoles().includes(role);
  }

  getUser(): User | null {
    return this.currentUser();
  }

  getUserEmail(): string {
    return this.currentUser()?.email ?? '';
  }

  getUserId(): string {
    return this.currentUser()?.id ?? '';
  }
}
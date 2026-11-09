import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly router = inject(Router);
  
  readonly isLoading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly validationErrors = signal<ValidationError[]>([]);
  
  readonly formData = signal<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  readonly emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly minPasswordLength = 8;
  
  onEmailChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(form => ({ ...form, email: value }));
    this.clearFieldError('email');
  }
  
  onPasswordChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(form => ({ ...form, password: value }));
    this.clearFieldError('password');
  }
  
  onRememberMeChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.formData.update(form => ({ ...form, rememberMe: checked }));
  }
  
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }
  
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    try {
      await this.performLogin();
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  private validateForm(): boolean {
    const errors: ValidationError[] = [];
    const { email, password } = this.formData();
    
    if (!email || !this.emailRegex.test(email)) {
      errors.push({
        field: 'email',
        message: 'Por favor ingresa un correo electrónico válido'
      });
    }
    
    if (!password || password.length < this.minPasswordLength) {
      errors.push({
        field: 'password',
        message: `La contraseña debe tener al menos ${this.minPasswordLength} caracteres`
      });
    }
    
    if (errors.length > 0) {
      this.validationErrors.set(errors);
      return false;
    }
    
    return true;
  }
  
  private async performLogin(): Promise<void> {
    const { email, password, rememberMe } = this.formData();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validCredentials = [
      { email: 'admin@ecommerce.com', password: 'admin123', role: 'admin' },
      { email: 'user@ecommerce.com', password: 'user123', role: 'user' }
    ];
    
    const found = validCredentials.find(
      c => c.email === email && c.password === password
    );
    
    if (found) {
      this.storeAuthToken(found.role, rememberMe);
      this.navigateAfterLogin(found.role);
    } else {
      throw new Error('Credenciales inválidas. Por favor verifica tu correo y contraseña.');
    }
  }
  
  private storeAuthToken(role: string, rememberMe: boolean): void {
    const token = btoa(`${role}:${Date.now()}`);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_token', token);
    storage.setItem('user_role', role);
  }
  
  private navigateAfterLogin(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/analytics']);
    } else {
      this.router.navigate(['/orders']);
    }
  }
  
  private handleLoginError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    this.errorMessage.set(message);
  }
  
  private clearFieldError(field: string): void {
    this.validationErrors.update(errors => 
      errors.filter(e => e.field !== field)
    );
  }
  
  getFieldError(field: string): string | undefined {
    return this.validationErrors().find(e => e.field === field)?.message;
  }
  
  hasFieldError(field: string): boolean {
    return this.validationErrors().some(e => e.field === field);
  }
  
  clearError(): void {
    this.errorMessage.set(null);
  }
}
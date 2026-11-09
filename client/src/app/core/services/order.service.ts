import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Order, OrderEvent } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSignal = signal<Order[]>([]);
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {
    this.setupOrderStream();
  }

  /**
   * Obtiene el estado reactivo de las órdenes.
   */
  get orders() {
    return this.ordersSignal.asReadonly();
  }

  /**
   * Crea una nueva orden.
   * @param orderData Datos de la orden a crear.
   */
  createOrder(orderData: { productId: string; quantity: number; customerId: string }): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, orderData).pipe(
      catchError(error => {
        console.error('Error creating order:', error);
        return throwError(() => new Error('Failed to create order'));
      })
    );
  }

  /**
   * Configura la conexión SSE para recibir eventos de órdenes en tiempo real.
   */
  private setupOrderStream(): void {
    this.eventSource = new EventSource(`${environment.apiUrl}/orders/stream`);

    this.eventSource.onmessage = (event) => {
      try {
        const orderEvent: OrderEvent = JSON.parse(event.data);
        this.handleOrderEvent(orderEvent);
      } catch (error) {
        console.error('Error parsing order event:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      this.reconnectOrderStream();
    };
  }

  /**
   * Maneja un evento de orden recibido por SSE.
   * @param event Evento de orden.
   */
  private handleOrderEvent(event: OrderEvent): void {
    const currentOrders = this.ordersSignal();
    switch (event.type) {
      case 'created':
        this.ordersSignal.set([...currentOrders, event.payload]);
        break;
      case 'updated':
        const updatedOrders = currentOrders.map(order =>
          order.id === event.payload.id ? event.payload : order
        );
        this.ordersSignal.set(updatedOrders);
        break;
      case 'cancelled':
        const filteredOrders = currentOrders.filter(order =>
          order.id !== event.payload.id
        );
        this.ordersSignal.set(filteredOrders);
        break;
    }
  }

  /**
   * Intenta reconectar el stream SSE después de un error.
   */
  private reconnectOrderStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
    setTimeout(() => {
      this.setupOrderStream();
    }, 3000);
  }

  /**
   * Limpia recursos al destruir el servicio.
   */
  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
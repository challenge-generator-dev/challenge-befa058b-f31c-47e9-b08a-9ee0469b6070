import { OrderStatus } from '../types/order-status.type';

/**
 * Modelo de datos para órdenes en el frontend.
 * Representa la información de una orden recibida desde el backend.
 */
export interface Order {
  id: string;
  productId: string;
  quantity: number;
  customerId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Tipo para los eventos de órdenes recibidos por SSE.
 */
export interface OrderEvent {
  type: 'created' | 'updated' | 'cancelled';
  payload: Order;
}
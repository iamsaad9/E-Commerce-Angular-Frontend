import { OrderItems } from '../../orderItems/model/items.model';

export interface Order {
  id: string;
  totalAmout: number;
  status: string;
  userId: string;
  items: OrderItems[];
}

export interface CreateOrderCommand {
  userId: string;
  items: OrderItems[];
}

export interface UpdateOrderCommand {
  userId: string;
  status: string;
  items: OrderItems[];
}

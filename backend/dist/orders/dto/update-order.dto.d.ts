import { OrderItemDto } from './create-order.dto';
export declare class UpdateOrderDto {
    type?: 'LOCAL' | 'DOMICILIO';
    customerId?: string;
    items?: OrderItemDto[];
    total?: number;
}

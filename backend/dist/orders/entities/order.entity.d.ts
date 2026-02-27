export declare class OrderItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    addedIngredients?: string[];
}
export declare class Order {
    id: string;
    ticketId: string;
    type: 'LOCAL' | 'DOMICILIO';
    date: Date;
    customerId?: string;
    items: OrderItem[];
    total: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
}

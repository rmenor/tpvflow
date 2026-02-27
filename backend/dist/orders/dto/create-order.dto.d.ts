export declare class OrderItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    addedIngredients?: string[];
}
export declare class CreateOrderDto {
    type: 'LOCAL' | 'DOMICILIO';
    customerId?: string;
    items: OrderItemDto[];
    total: number;
}

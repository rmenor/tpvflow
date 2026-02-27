export interface Product {
    id: string;
    categoryId: string;
    name: string;
    price: number;
    ingredients?: string[];
}

export interface Category {
    id: string;
    name: string;
}

export interface Customer {
    id: string;
    name: string;
    address: string;
    phone?: string;
}

export interface OrderItem extends Product {
    originalId?: string;
    quantity: number;
    customIngredients?: string[];
}

export interface Order {
    id: string;
    items: OrderItem[];
    itemsCount: number;
    total: number;
    orderType: "LOCAL" | "DOMICILIO";
    client: Customer;
    tableNumber?: string;
    dinersCount?: number;
    status?: "aparcado" | "reservado" | "pagado";
    paymentMethod?: "EFECTIVO" | "TARJETA";
    tenderedAmount?: string | null;
    date?: string;
    time?: string;
}

export interface Employee {
    id: string;
    name: string;
    pin: string;
    role: "admin" | "waiter" | "Manager" | "Cajera" | "Camarero";
    initials?: string;
    color?: string;
}

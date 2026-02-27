import { useState, useMemo } from 'react';
import { OrderItem, Product } from '../types';

export const useCart = () => {
    const [cart, setCart] = useState<OrderItem[]>([]);

    const addToCart = (product: Product, customIngredients?: string[], extraPrice: number = 0) => {
        setCart((prev) => {
            const isCustomized = customIngredients && customIngredients.length > 0;
            const finalId = isCustomized ? `${product.id}-${[...customIngredients].sort().join('-')}` : product.id;

            const existing = prev.find((item) => item.id === finalId);
            if (existing) {
                return prev.map((item) =>
                    item.id === finalId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    ...product,
                    id: finalId,
                    originalId: product.id,
                    quantity: 1,
                    price: product.price + extraPrice,
                    customIngredients
                }
            ];
        });
    };

    const removeFromCart = (product: OrderItem) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing && existing.quantity > 1) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
            return prev.filter((item) => item.id !== product.id);
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [cart]);

    return { cart, setCart, addToCart, removeFromCart, clearCart, total };
};

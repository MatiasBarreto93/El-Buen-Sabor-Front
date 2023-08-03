import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Item} from "../../interfaces/products.ts";

type CartItem = Item & {quantity: number};

type CartContextProps = {
    items: CartItem[];
    addToCart: (item: Item, quantity: number) => void;
    removeFromCart: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
};

export function useCart() {
    const context = React.useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export const CartContext = React.createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [items, setItems] = useState<CartItem[]>(() => {
        const savedItems = window.localStorage.getItem('cartItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    useEffect(() => {
        window.localStorage.setItem('cartItems', JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((item: Item, quantity: number) => {
        setItems((prevItems) => {
            //Update quantity if exist on the cart
            const existingItem = prevItems.find((i) => i.id === item.id);
            if (existingItem) {
                //Limit the max quantity to currentStock
                const newQuantity = existingItem.quantity + quantity > item.currentStock ? item.currentStock : existingItem.quantity + quantity;
                return prevItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: newQuantity } : i
                );
            } else {
                //New item is added
                return [...prevItems, { ...item, quantity }];
            }
        });
    }, []);

    const removeFromCart = useCallback((itemId: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const value = useMemo(() => ({ items, addToCart, removeFromCart, updateQuantity, clearCart }), [items, addToCart, removeFromCart, updateQuantity, clearCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

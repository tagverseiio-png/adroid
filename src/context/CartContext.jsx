import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'adroit_shop_cart';

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        try {
            const saved = localStorage.getItem(CART_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    // Persist to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i =>
                    i.product.id === product.id
                        ? { ...i, qty: Math.min(i.qty + qty, product.stock_qty || 99) }
                        : i
                );
            }
            return [...prev, { product, qty }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((productId) => {
        setItems(prev => prev.filter(i => i.product.id !== productId));
    }, []);

    const updateQty = useCallback((productId, qty) => {
        if (qty <= 0) {
            setItems(prev => prev.filter(i => i.product.id !== productId));
            return;
        }
        setItems(prev => prev.map(i =>
            i.product.id === productId ? { ...i, qty } : i
        ));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

    const cartTotal = items.reduce((sum, i) => {
        const price = parseFloat(i.product.sale_price || i.product.price);
        return sum + price * i.qty;
    }, 0);

    return (
        <CartContext.Provider value={{
            items, itemCount, cartTotal,
            addToCart, removeFromCart, updateQty, clearCart,
            isOpen, setIsOpen,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
};

export default CartContext;

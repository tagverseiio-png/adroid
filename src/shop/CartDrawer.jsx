import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { normalizeAssetUrl } from '../services/api';

const CartDrawer = ({ onCheckout }) => {
    const { items, itemCount, cartTotal, isOpen, setIsOpen, removeFromCart, updateQty } = useCart();
    const freeShippingThreshold = 999;
    const shippingCharge = cartTotal >= freeShippingThreshold ? 0 : 99;

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[60]"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Drawer */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: isOpen ? 0 : '100%' }}
                transition={{ type: 'tween', duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-white z-[70] flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                        <ShoppingCart size={20} className="text-stone-700" strokeWidth={1.5} />
                        <h2 className="font-bold text-stone-900 uppercase tracking-widest text-sm">Cart</h2>
                        {itemCount > 0 && (
                            <span className="bg-[#C5A059] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-500 hover:text-stone-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <ShoppingBag size={48} className="text-stone-200" strokeWidth={1} />
                            <div>
                                <p className="font-bold text-stone-400 text-sm">Your cart is empty</p>
                                <p className="text-stone-300 text-xs mt-1">Add items from the shop to get started</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:underline"
                            >
                                Continue Shopping →
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Free shipping progress */}
                            {cartTotal < freeShippingThreshold && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-2">
                                    <p className="text-xs text-amber-700 font-medium">
                                        Add ₹{(freeShippingThreshold - cartTotal).toLocaleString('en-IN')} more for free shipping!
                                    </p>
                                    <div className="mt-2 bg-amber-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="h-full bg-[#C5A059] rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {items.map(({ product, qty }) => {
                                const unitPrice = parseFloat(product.sale_price || product.price);
                                const img = normalizeAssetUrl(product.cover_image);
                                return (
                                    <div key={product.id} className="flex gap-4 bg-stone-50 rounded-xl p-3 border border-stone-100">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                                            {img ? (
                                                <img src={img} alt={product.name} className="w-full h-full object-cover"
                                                    onError={e => { e.target.onerror = null; }} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={20} className="text-stone-400" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-stone-800 text-sm leading-tight line-clamp-2">{product.name}</p>
                                            <p className="text-[#C5A059] font-bold text-sm mt-1">₹{unitPrice.toLocaleString('en-IN')}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                                                    <button onClick={() => updateQty(product.id, qty - 1)} className="px-2.5 py-1.5 hover:bg-stone-50 transition-colors"><Minus size={12} /></button>
                                                    <span className="px-3 text-xs font-bold">{qty}</span>
                                                    <button onClick={() => updateQty(product.id, Math.min(qty + 1, product.stock_qty || 99))} className="px-2.5 py-1.5 hover:bg-stone-50 transition-colors"><Plus size={12} /></button>
                                                </div>
                                                <button onClick={() => removeFromCart(product.id)} className="text-stone-300 hover:text-red-400 transition-colors p-1">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-stone-100 p-6 space-y-3">
                        <div className="flex justify-between text-sm text-stone-500">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-stone-500">
                            <span>Shipping</span>
                            <span className={shippingCharge === 0 ? 'text-emerald-600 font-medium' : ''}>
                                {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                            </span>
                        </div>
                        <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-100">
                            <span>Total</span>
                            <span className="text-[#C5A059]">₹{(cartTotal + shippingCharge).toLocaleString('en-IN')}</span>
                        </div>
                        <button
                            onClick={() => { setIsOpen(false); onCheckout(); }}
                            className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-amber-600 text-black font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all duration-200 mt-2"
                        >
                            Proceed to Checkout <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors py-1"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default CartDrawer;

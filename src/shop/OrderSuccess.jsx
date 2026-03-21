import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const OrderSuccess = ({ orderNumber, onShop, onTrack }) => {
    const { clearCart } = useCart();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        clearCart();
        if (orderNumber) {
            orderAPI.getByOrderNumber(orderNumber)
                .then(res => { if (res.success) setOrder(res.data); })
                .catch(console.error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderNumber]);

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-24">
            <div className="max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-stone-900 mb-2">Order Confirmed!</h1>
                <p className="text-stone-500 mb-2">Thank you for your purchase. Your order has been placed successfully.</p>
                {orderNumber && (
                    <div className="bg-white border border-stone-100 rounded-2xl px-6 py-4 shadow-sm mb-6 inline-block">
                        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Order Number</p>
                        <p className="text-lg font-bold text-[#C5A059] font-mono">{orderNumber}</p>
                    </div>
                )}
                {order && (
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 mb-6 text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Order Details</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Total</span>
                                <span className="font-bold text-stone-900">₹{parseFloat(order.total).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Payment</span>
                                <span className="font-bold text-emerald-600 capitalize">{order.payment_status}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Status</span>
                                <span className="font-bold text-stone-700 capitalize">{order.order_status}</span>
                            </div>
                        </div>
                    </div>
                )}
                <p className="text-xs text-stone-400 mb-6">A confirmation email will be sent to your email address.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => onTrack(orderNumber)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                        <Package size={16} /> Track Order
                    </button>
                    <button
                        onClick={onShop}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-amber-600 text-black text-sm font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                        Continue Shopping <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;

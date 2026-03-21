import React, { useState } from 'react';
import { Search, Package, Loader2, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { orderAPI } from '../services/api';

const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_LABELS = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
};

const OrderTracking = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim() || !email.trim()) return;
        setLoading(true);
        setError('');
        setOrder(null);
        setSearched(true);
        try {
            const res = await orderAPI.lookup(orderNumber.trim(), email.trim());
            if (res.success) setOrder(res.data);
        } catch (err) {
            setError(err.message || 'Order not found. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const currentStep = order ? STATUS_STEPS.indexOf(order.order_status) : -1;
    const isCancelled = order?.order_status === 'cancelled' || order?.order_status === 'returned';

    return (
        <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <Package size={40} className="mx-auto text-[#C5A059] mb-4" strokeWidth={1.5} />
                    <h1 className="text-2xl font-bold text-stone-900 uppercase tracking-widest mb-2">Track Your Order</h1>
                    <p className="text-stone-500 text-sm">Enter your order number and email to check the status.</p>
                </div>

                <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm mb-8">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Order Number</label>
                            <input
                                value={orderNumber}
                                onChange={e => setOrderNumber(e.target.value)}
                                placeholder="e.g. AD-M1ABC-XYZ"
                                className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email used at checkout"
                                className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059]"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-amber-600 disabled:bg-stone-300 text-black font-bold text-sm uppercase tracking-wider py-3 rounded-xl transition-all"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        {loading ? 'Searching...' : 'Track Order'}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>
                )}

                {order && (
                    <div className="space-y-5">
                        {/* Order Info */}
                        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Order Number</p>
                                    <p className="text-lg font-bold text-stone-900 font-mono">{order.order_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-stone-400 mb-1">Placed on</p>
                                    <p className="text-sm font-medium text-stone-700">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-stone-100">
                                <div>
                                    <p className="text-xs text-stone-400 mb-1">Total</p>
                                    <p className="font-bold text-stone-900">₹{parseFloat(order.total).toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400 mb-1">Payment</p>
                                    <p className={`font-bold capitalize ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.payment_status}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-stone-400 mb-1">Status</p>
                                    <p className="font-bold text-stone-700 capitalize">{STATUS_LABELS[order.order_status] || order.order_status}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        {!isCancelled && (
                            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-6">Order Progress</h3>
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-stone-100" />
                                    {STATUS_STEPS.map((step, idx) => {
                                        const isDone = currentStep > idx;
                                        const isCurrent = currentStep === idx;
                                        return (
                                            <div key={step} className="relative flex items-start gap-4 pb-6 last:pb-0">
                                                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-[#C5A059]' : 'bg-stone-200'}`}>
                                                    {isDone ? <CheckCircle size={16} className="text-white" /> :
                                                        isCurrent ? <Clock size={16} className="text-black" /> :
                                                            <div className="w-2.5 h-2.5 rounded-full bg-stone-400" />}
                                                </div>
                                                <div className="pt-1">
                                                    <p className={`text-sm font-bold ${isDone || isCurrent ? 'text-stone-900' : 'text-stone-400'}`}>{STATUS_LABELS[step]}</p>
                                                    {isCurrent && <p className="text-xs text-[#C5A059] mt-0.5">Current Status</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Tracking */}
                        {order.awb_code && (
                            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Truck size={18} className="text-[#C5A059]" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700">Shipping Info</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {order.courier_name && <p><span className="text-stone-400">Courier:</span> <span className="font-medium text-stone-700">{order.courier_name}</span></p>}
                                    {order.awb_code && <p><span className="text-stone-400">AWB Code:</span> <span className="font-mono font-medium text-stone-700">{order.awb_code}</span></p>}
                                </div>
                            </div>
                        )}

                        {/* Shipping Address */}
                        {order.shipping_address && (
                            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <MapPin size={18} className="text-[#C5A059]" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-700">Delivery Address</h3>
                                </div>
                                {(() => {
                                    const addr = typeof order.shipping_address === 'string'
                                        ? JSON.parse(order.shipping_address)
                                        : order.shipping_address;
                                    return (
                                        <p className="text-sm text-stone-600 leading-relaxed">
                                            {[addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                                        </p>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;

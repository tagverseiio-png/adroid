import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Truck, Eye, X, Loader2, Search } from 'lucide-react';
import { orderAPI } from '../../services/api';

const STATUS_COLORS = {
    placed: 'text-sky-400 bg-sky-400/10',
    confirmed: 'text-blue-400 bg-blue-400/10',
    processing: 'text-amber-400 bg-amber-400/10',
    shipped: 'text-violet-400 bg-violet-400/10',
    delivered: 'text-emerald-400 bg-emerald-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
    returned: 'text-rose-400 bg-rose-400/10',
};

const PAYMENT_COLORS = {
    pending: 'text-amber-400 bg-amber-400/10',
    paid: 'text-emerald-400 bg-emerald-400/10',
    failed: 'text-red-400 bg-red-400/10',
    refunded: 'text-purple-400 bg-purple-400/10',
};

const ORDER_STATUSES = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [viewOrder, setViewOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});
    const [creatingShipment, setCreatingShipment] = useState({});
    const [total, setTotal] = useState(0);
    const [revenue, setRevenue] = useState(0);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = { limit: 100 };
            if (statusFilter) params.status = statusFilter;
            if (search) params.search = search;
            const res = await orderAPI.getAll(params);
            if (res.success) {
                setOrders(res.data);
                setTotal(res.total);
                setRevenue(res.revenue);
            }
        } catch (err) { console.error(err); }
        setLoading(false);
    }, [search, statusFilter]);

    useEffect(() => {
        const t = setTimeout(fetchOrders, 300);
        return () => clearTimeout(t);
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingStatus(s => ({ ...s, [orderId]: true }));
        try {
            await orderAPI.updateStatus(orderId, newStatus);
            setOrders(o => o.map(x => x.id === orderId ? { ...x, order_status: newStatus } : x));
        } catch (err) { console.error(err); }
        setUpdatingStatus(s => ({ ...s, [orderId]: false }));
    };

    const handleCreateShipment = async (orderId) => {
        setCreatingShipment(s => ({ ...s, [orderId]: true }));
        try {
            await orderAPI.createShipment(orderId);
            await fetchOrders();
            alert('Shipment created on Shiprocket!');
        } catch (err) {
            alert('Shipment failed: ' + (err.message || 'Unknown error'));
        }
        setCreatingShipment(s => ({ ...s, [orderId]: false }));
    };

    const orderItems = viewOrder ? (
        typeof viewOrder.items === 'string' ? JSON.parse(viewOrder.items) : viewOrder.items
    ) : [];
    const orderAddr = viewOrder ? (
        typeof viewOrder.shipping_address === 'string' ? JSON.parse(viewOrder.shipping_address) : viewOrder.shipping_address
    ) : {};

    return (
        <div>
            {/* Header + Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
                    <p className="text-white/40 text-sm">{total} total · Revenue: ₹{parseFloat(revenue).toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order #, name, email..."
                        className="w-72 pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A059]/50" />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50">
                    <option value="">All Statuses</option>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C5A059]" size={28} /></div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/8">
                                {['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan={7} className="text-center text-white/30 py-12">No orders found</td></tr>
                            ) : orders.map(o => (
                                <tr key={o.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                    <td className="px-4 py-3 font-mono text-[#C5A059] font-bold text-xs">{o.order_number}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-white font-medium text-sm">{o.customer_name}</p>
                                        <p className="text-white/40 text-xs">{o.customer_email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-white font-bold">₹{parseFloat(o.total).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PAYMENT_COLORS[o.payment_status] || 'text-white/40 bg-white/10'}`}>
                                            {o.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={o.order_status}
                                            onChange={e => handleStatusChange(o.id, e.target.value)}
                                            disabled={updatingStatus[o.id]}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 bg-transparent cursor-pointer focus:outline-none ${STATUS_COLORS[o.order_status] || 'text-white/40'}`}
                                        >
                                            {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-[#111] text-white">{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-white/40 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <button onClick={() => setViewOrder(o)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                <Eye size={14} />
                                            </button>
                                            {o.payment_status === 'paid' && !o.shiprocket_order_id && (
                                                <button
                                                    onClick={() => handleCreateShipment(o.id)}
                                                    disabled={creatingShipment[o.id]}
                                                    title="Create Shiprocket Shipment"
                                                    className="p-1.5 text-white/40 hover:text-[#C5A059] hover:bg-[#C5A059]/10 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {creatingShipment[o.id] ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Detail Modal */}
            {viewOrder && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-xl my-8 shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div>
                                <h2 className="text-white font-bold">Order Detail</h2>
                                <p className="text-[#C5A059] text-xs font-mono">{viewOrder.order_number}</p>
                            </div>
                            <button onClick={() => setViewOrder(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-white/40 text-xs mb-1">Customer</p><p className="text-white font-medium">{viewOrder.customer_name}</p></div>
                                <div><p className="text-white/40 text-xs mb-1">Email</p><p className="text-white font-medium">{viewOrder.customer_email}</p></div>
                                <div><p className="text-white/40 text-xs mb-1">Phone</p><p className="text-white font-medium">{viewOrder.customer_phone}</p></div>
                                <div><p className="text-white/40 text-xs mb-1">Date</p><p className="text-white font-medium">{new Date(viewOrder.created_at).toLocaleDateString()}</p></div>
                            </div>

                            <div>
                                <p className="text-white/40 text-xs mb-1">Shipping Address</p>
                                <p className="text-white text-sm">{[orderAddr.line1, orderAddr.line2, orderAddr.city, orderAddr.state, orderAddr.pincode].filter(Boolean).join(', ')}</p>
                            </div>

                            <div>
                                <p className="text-white/40 text-xs mb-2 uppercase tracking-wider font-bold">Items</p>
                                <div className="space-y-2">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-2 text-sm">
                                            <div>
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-white/40 text-xs">Qty: {item.qty} × ₹{parseFloat(item.unit_price).toLocaleString('en-IN')}</p>
                                            </div>
                                            <p className="text-[#C5A059] font-bold">₹{parseFloat(item.total_price).toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-1 text-sm">
                                <div className="flex justify-between text-white/50"><span>Subtotal</span><span>₹{parseFloat(viewOrder.subtotal).toLocaleString('en-IN')}</span></div>
                                {parseFloat(viewOrder.discount_amount) > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-₹{parseFloat(viewOrder.discount_amount).toLocaleString('en-IN')}</span></div>}
                                <div className="flex justify-between text-white/50"><span>Shipping</span><span>{parseFloat(viewOrder.shipping_charge || 0) === 0 ? 'FREE' : `₹${parseFloat(viewOrder.shipping_charge).toLocaleString('en-IN')}`}</span></div>
                                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10"><span>Total</span><span className="text-[#C5A059]">₹{parseFloat(viewOrder.total).toLocaleString('en-IN')}</span></div>
                            </div>

                            {viewOrder.awb_code && (
                                <div className="bg-white/5 rounded-xl p-4 text-sm">
                                    <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Shipping</p>
                                    <p className="text-white">AWB: <span className="font-mono text-[#C5A059]">{viewOrder.awb_code}</span></p>
                                    {viewOrder.courier_name && <p className="text-white/60 text-xs mt-1">via {viewOrder.courier_name}</p>}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;

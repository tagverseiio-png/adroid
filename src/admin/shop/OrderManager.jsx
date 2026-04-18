import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Truck, Eye, X, Loader2, Search, RefreshCw,
    CheckCircle, XCircle, Clock, AlertTriangle, Ban,
    MapPin, ChevronRight, ArrowRight, Warehouse, Bell,
    ShieldCheck, CreditCard, ChevronDown
} from 'lucide-react';
import { orderAPI, pickupLocationsAPI, payuAPI } from '../../services/api';

// ── Status flow config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    placed:           { label: 'Placed',           color: 'text-sky-400    bg-sky-400/10    border-sky-400/20',    step: 0 },
    confirmed:        { label: 'Confirmed',        color: 'text-blue-400   bg-blue-400/10   border-blue-400/20',   step: 1 },
    preparing:        { label: 'Preparing',        color: 'text-amber-400  bg-amber-400/10  border-amber-400/20',  step: 2 },
    ready:            { label: 'Ready',            color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', step: 3 },
    shipped:          { label: 'Shipped',          color: 'text-violet-400 bg-violet-400/10 border-violet-400/20', step: 4 },
    out_for_delivery: { label: 'Out for Delivery', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', step: 5 },
    delivered:        { label: 'Delivered',        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', step: 6 },
    cancelled:        { label: 'Cancelled',        color: 'text-red-400    bg-red-400/10    border-red-400/20',    step: -1 },
    returned:         { label: 'Returned',         color: 'text-rose-400   bg-rose-400/10   border-rose-400/20',   step: -1 },
};

const PAYMENT_CONFIG = {
    pending:  { label: 'Pending',  color: 'text-amber-400  bg-amber-400/10' },
    paid:     { label: 'Paid',     color: 'text-emerald-400 bg-emerald-400/10' },
    failed:   { label: 'Failed',   color: 'text-red-400    bg-red-400/10' },
    refunded: { label: 'Refunded', color: 'text-purple-400 bg-purple-400/10' },
};

// Admin selectable statuses (manual — not auto ones like 'shipped' set by Shiprocket)
const ADMIN_STATUSES = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

// Tabs
const TABS = [
    { id: 'new',       label: 'New Orders',  icon: Bell,    filter: o => o.order_status === 'confirmed' && o.payment_status === 'paid' },
    { id: 'progress',  label: 'In Progress', icon: Truck,   filter: o => ['preparing', 'ready', 'shipped', 'out_for_delivery'].includes(o.order_status) },
    { id: 'done',      label: 'Delivered',   icon: CheckCircle, filter: o => o.order_status === 'delivered' },
    { id: 'issues',    label: 'Issues',      icon: AlertTriangle, filter: o => ['cancelled', 'returned', 'placed'].includes(o.order_status) || o.payment_status === 'failed' },
    { id: 'all',       label: 'All',         icon: Package, filter: () => true },
];

// ── Small helpers ─────────────────────────────────────────────────────────────

const Badge = ({ value, config }) => {
    const c = config[value] || { label: value, color: 'text-white/40 bg-white/10' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-transparent ${c.color}`}>
            {c.label}
        </span>
    );
};

const InfoBlock = ({ label, value, mono }) => (
    <div>
        <p className="text-white/35 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-white text-sm ${mono ? 'font-mono' : 'font-medium'} break-all`}>{value || '—'}</p>
    </div>
);

// ── Progress Tracker component ────────────────────────────────────────────────
const ProgressBar = ({ status }) => {
    const steps = ['confirmed', 'preparing', 'ready', 'shipped', 'out_for_delivery', 'delivered'];
    const labels = ['Confirmed', 'Preparing', 'Ready', 'Shipped', 'Out for Delivery', 'Delivered'];
    const current = STATUS_CONFIG[status]?.step ?? -1;

    if (current < 0) return null; // cancelled / returned — no bar

    return (
        <div className="flex items-center gap-0 w-full mb-6">
            {steps.map((s, i) => {
                const done    = i < current;
                const active  = i === current;
                const future  = i > current;
                return (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                                done   ? 'bg-emerald-400 border-emerald-400 text-black' :
                                active ? 'bg-[#C5A059] border-[#C5A059] text-black' :
                                         'bg-white/5 border-white/15 text-white/30'
                            }`}>
                                {done ? '✓' : i + 1}
                            </div>
                            <p className={`text-[8px] whitespace-nowrap ${active ? 'text-[#C5A059] font-bold' : done ? 'text-emerald-400' : 'text-white/25'}`}>
                                {labels[i]}
                            </p>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`flex-1 h-[2px] mx-1 mb-4 rounded ${done ? 'bg-emerald-400' : 'bg-white/10'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

// ── Order Detail Modal ────────────────────────────────────────────────────────
const OrderDetailModal = ({ order: initialOrder, pickupLocations, onClose, onRefresh }) => {
    const [order, setOrder]               = useState(initialOrder);
    const [newStatus, setNewStatus]       = useState(initialOrder.order_status);
    const [pickupLoc, setPickupLoc]       = useState(initialOrder.pickup_location_name || '');
    const [updating, setUpdating]         = useState(false);
    const [cancelling, setCancelling]     = useState(false);
    const [verifying, setVerifying]       = useState(false);
    const [showMarkPaid, setShowMarkPaid] = useState(false);
    const [markingPaid, setMarkingPaid]   = useState(false);
    const [paidMethod, setPaidMethod]     = useState('UPI');
    const [paidTxnId, setPaidTxnId]       = useState('');
    const [paidNote, setPaidNote]         = useState('');
    const [toast, setToast]               = useState(null); // { msg, type: 'success'|'error'|'warn' }

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const items   = Array.isArray(order.items)            ? order.items            : JSON.parse(order.items || '[]');
    const addr    = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : (order.shipping_address || {});
    const addrStr = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');

    const applyStatusChange = async () => {
        if (!newStatus || newStatus === order.order_status) return;

        // Validation before marking ready
        if (newStatus === 'ready') {
            if (order.payment_status !== 'paid') {
                return showToast('Order must be paid before marking as ready', 'error');
            }
            if (!pickupLoc) {
                return showToast('Please select a pickup location before marking as ready', 'warn');
            }
        }

        setUpdating(true);
        try {
            const res = await orderAPI.updateStatus(order.id, newStatus, pickupLoc || undefined);
            setOrder(res.data || { ...order, order_status: newStatus });

            if (res.shiprocket_error) {
                showToast(`Status updated. Shiprocket warning: ${res.shiprocket_error}`, 'warn');
            } else if (newStatus === 'ready') {
                showToast('🚀 Marked ready! Shiprocket shipment created!', 'success');
            } else {
                showToast('Status updated successfully', 'success');
            }
            onRefresh();
        } catch (err) {
            showToast(err.message || 'Failed to update status', 'error');
        }
        setUpdating(false);
    };

    const handleCancel = async () => {
        if (!window.confirm('Cancel this order and restore stock to inventory?')) return;
        setCancelling(true);
        try {
            await orderAPI.cancelOrder(order.id);
            showToast('Order cancelled. Stock has been restored.', 'success');
            setOrder(o => ({ ...o, order_status: 'cancelled' }));
            onRefresh();
        } catch (err) {
            showToast(err.message || 'Failed to cancel order', 'error');
        }
        setCancelling(false);
    };

    const canCancel   = !['delivered', 'cancelled'].includes(order.order_status);
    const isShipped   = ['shipped', 'out_for_delivery', 'delivered'].includes(order.order_status);
    const isPaid      = order.payment_status === 'paid';

    // ── Verify payment via PayU live API ─────────────────────────────────────
    const handleVerifyPayment = async () => {
        setVerifying(true);
        try {
            const res = await payuAPI.verifyPayment(order.order_number);
            if (res.autoFixed) {
                setOrder(o => ({ ...o, payment_status: 'paid', order_status: ['placed','cancelled'].includes(o.order_status) ? 'confirmed' : o.order_status }));
                showToast('✅ PayU confirms payment! Order updated to PAID.', 'success');
                onRefresh();
            } else if (res.payuStatus === 'success') {
                showToast('PayU confirms: already paid ✓', 'success');
            } else if (res.payuStatus === 'unknown') {
                showToast(res.message || 'No PayU record found for this order.', 'warn');
            } else {
                showToast(`PayU status: ${res.payuStatus || 'unknown'}`, 'warn');
            }
        } catch (err) {
            showToast(err.message || 'Verification failed', 'error');
        }
        setVerifying(false);
    };

    // ── Manual mark as paid ───────────────────────────────────────────────────
    const handleMarkPaid = async () => {
        if (!window.confirm(`Mark this order as PAID via ${paidMethod}? This cannot be undone easily.`)) return;
        setMarkingPaid(true);
        try {
            await payuAPI.markPaid(order.order_number, {
                method: paidMethod,
                txn_id: paidTxnId,
                note:   paidNote,
            });
            setOrder(o => ({ ...o, payment_status: 'paid', payment_method: paidMethod, order_status: ['placed','cancelled'].includes(o.order_status) ? 'confirmed' : o.order_status }));
            showToast('Order manually marked as paid.', 'success');
            setShowMarkPaid(false);
            onRefresh();
        } catch (err) {
            showToast(err.message || 'Failed to mark as paid', 'error');
        }
        setMarkingPaid(false);
    };

    const toastColors = {
        success: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300',
        error:   'bg-red-500/10    border-red-500/30    text-red-300',
        warn:    'bg-amber-400/10  border-amber-400/30  text-amber-300',
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.97 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl my-8 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]">
                    <div>
                        <h2 className="text-white font-bold">Order Details</h2>
                        <p className="text-[#C5A059] text-xs font-mono mt-0.5">{order.order_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge value={order.payment_status} config={PAYMENT_CONFIG} />
                        <Badge value={order.order_status}   config={STATUS_CONFIG} />
                        <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition-colors p-1">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">

                    {/* Toast */}
                    <AnimatePresence>
                        {toast && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`border rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${toastColors[toast.type]}`}
                            >
                                {toast.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                {toast.msg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Progress bar */}
                    <ProgressBar status={order.order_status} />

                    {/* Customer */}
                    <div>
                        <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mb-3">Customer</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <InfoBlock label="Name"  value={order.customer_name} />
                            <InfoBlock label="Email" value={order.customer_email} />
                            <InfoBlock label="Phone" value={order.customer_phone} />
                            <InfoBlock label="Placed" value={new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} />
                            {order.coupon_code && <InfoBlock label="Coupon" value={order.coupon_code} mono />}
                            {order.notes       && <div className="col-span-2"><InfoBlock label="Notes" value={order.notes} /></div>}
                        </div>
                    </div>

                    {/* Delivery address */}
                    <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-3 flex gap-3">
                        <MapPin size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-white/35 text-[10px] uppercase tracking-wider mb-1">Delivery Address (Customer)</p>
                            <p className="text-white text-sm">{addrStr || '—'}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mb-3">Items ({items.length})</p>
                        <div className="space-y-2">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                                    <div>
                                        <p className="text-white font-medium text-sm">{item.name}</p>
                                        <p className="text-white/40 text-xs mt-0.5 font-mono">
                                            SKU: {item.sku || '—'} &nbsp;·&nbsp; Qty: {item.qty} × ₹{parseFloat(item.unit_price).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <p className="text-[#C5A059] font-bold text-sm flex-shrink-0 ml-4">
                                        ₹{parseFloat(item.total_price).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-4 space-y-2 text-sm">
                        <div className="flex justify-between text-white/50"><span>Subtotal</span><span>₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span></div>
                        {parseFloat(order.discount_amount) > 0 && (
                            <div className="flex justify-between text-emerald-400">
                                <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                                <span>−₹{parseFloat(order.discount_amount).toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-white/50">
                            <span>Shipping</span>
                            <span>{parseFloat(order.shipping_charge || 0) === 0 ? 'FREE' : `₹${parseFloat(order.shipping_charge).toLocaleString('en-IN')}`}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                            <span>Total</span>
                            <span className="text-[#C5A059]">₹{parseFloat(order.total).toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Payment info */}
                    {order.payment_txn_id && (
                        <div className="bg-emerald-400/5 border border-emerald-400/15 rounded-xl px-4 py-3">
                            <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">Payment</p>
                            <div className="grid grid-cols-2 gap-2">
                                <InfoBlock label="Txn ID"   value={order.payment_txn_id} mono />
                                {order.payu_mihpayid  && <InfoBlock label="MihPayID" value={order.payu_mihpayid} mono />}
                                {order.payment_method && <InfoBlock label="Method"   value={order.payment_method} />}
                            </div>
                        </div>
                    )}

                    {/* ── Payment Recovery Actions (only when NOT paid) ── */}
                    {!isPaid && (
                        <div className="border border-amber-400/20 bg-amber-400/4 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle size={13} className="text-amber-400" />
                                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">Payment Not Confirmed</p>
                            </div>

                            {/* Verify with PayU button */}
                            <button
                                onClick={handleVerifyPayment}
                                disabled={verifying}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                            >
                                {verifying
                                    ? <><Loader2 size={13} className="animate-spin" /> Checking PayU…</>
                                    : <><ShieldCheck size={13} /> Verify with PayU</>}
                            </button>
                            <p className="text-white/30 text-[10px] text-center">
                                Queries PayU live — auto-updates order if payment succeeded.
                            </p>

                            {/* Mark as Paid toggle */}
                            <button
                                onClick={() => setShowMarkPaid(v => !v)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/8 border border-white/10 text-white/60 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                            >
                                <span className="flex items-center gap-2"><CreditCard size={13} /> Mark as Paid Manually</span>
                                <ChevronDown size={13} className={`transition-transform ${showMarkPaid ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showMarkPaid && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Payment Method</label>
                                                    <select
                                                        value={paidMethod}
                                                        onChange={e => setPaidMethod(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#C5A059]/50"
                                                    >
                                                        {['UPI', 'Cash', 'Bank Transfer', 'Card', 'PayU', 'Other'].map(m => (
                                                            <option key={m} value={m} className="bg-[#111]">{m}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Txn / Ref ID (optional)</label>
                                                    <input
                                                        value={paidTxnId}
                                                        onChange={e => setPaidTxnId(e.target.value)}
                                                        placeholder="e.g. 28234367428"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#C5A059]/50"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Admin Note (optional)</label>
                                                <input
                                                    value={paidNote}
                                                    onChange={e => setPaidNote(e.target.value)}
                                                    placeholder="Reason for manual override…"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#C5A059]/50"
                                                />
                                            </div>
                                            <button
                                                onClick={handleMarkPaid}
                                                disabled={markingPaid}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                                            >
                                                {markingPaid
                                                    ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                                                    : <><CheckCircle size={13} /> Confirm — Mark as Paid</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Shipment info */}
                    {order.awb_code && (
                        <div className="bg-violet-400/5 border border-violet-400/15 rounded-xl px-4 py-3">
                            <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">Shipment (Shiprocket)</p>
                            <div className="grid grid-cols-2 gap-2">
                                <InfoBlock label="AWB Code"       value={order.awb_code}             mono />
                                {order.courier_name           && <InfoBlock label="Courier"           value={order.courier_name} />}
                                {order.shiprocket_order_id    && <InfoBlock label="Shiprocket ID"     value={order.shiprocket_order_id} mono />}
                                {order.pickup_location_name   && <InfoBlock label="Pickup From"       value={order.pickup_location_name} />}
                            </div>
                        </div>
                    )}

                    {/* ── Admin Actions ── */}
                    {!isShipped && (
                        <div className="border-t border-white/10 pt-5 space-y-4">
                            <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold">Admin Actions</p>

                            {/* Pickup location — free text input */}
                            {order.payment_status === 'paid' && !order.awb_code && (
                                <div>
                                    <label className="block text-white/50 text-xs mb-1.5 font-medium">
                                        <Warehouse size={11} className="inline mr-1" />
                                        Pickup Location (Warehouse / Store)
                                    </label>
                                    <input
                                        type="text"
                                        value={pickupLoc}
                                        onChange={e => setPickupLoc(e.target.value)}
                                        placeholder="e.g. Main Warehouse, Chennai"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C5A059]/50"
                                    />
                                    {pickupLoc && (
                                        <p className="text-white/30 text-xs mt-1.5">
                                            Shiprocket will schedule a pickup from this location and deliver to the customer's address.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Status change */}
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <label className="block text-white/50 text-xs mb-1.5 font-medium">Update Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value)}
                                        disabled={updating}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50"
                                    >
                                        {ADMIN_STATUSES.map(s => (
                                            <option key={s} value={s} className="bg-[#111]">
                                                {STATUS_CONFIG[s]?.label || s}
                                                {s === 'ready' ? ' → Auto-triggers Shiprocket' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={applyStatusChange}
                                    disabled={updating || newStatus === order.order_status}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    {updating ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                                    Apply
                                </button>
                            </div>

                            {/* Hint for ready */}
                            {newStatus === 'ready' && (
                                <div className="flex items-start gap-2 text-amber-300/80 text-xs bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
                                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                                    <span>
                                        Marking as <strong>Ready</strong> will automatically create a Shiprocket order and schedule a pickup from the selected location. Make sure the product is packed and ready.
                                    </span>
                                </div>
                            )}

                            {/* Cancel */}
                            {canCancel && (
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500/8 hover:bg-red-500/15 text-red-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-red-500/20 disabled:opacity-50"
                                >
                                    {cancelling ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                                    Cancel Order & Restore Stock
                                </button>
                            )}
                        </div>
                    )}

                    {/* Shipped info */}
                    {isShipped && (
                        <div className="border-t border-white/10 pt-4">
                            <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mb-3">Admin Actions</p>
                            {/* Allow marking delivered manually */}
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <select
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value)}
                                        disabled={updating}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50"
                                    >
                                        {['shipped', 'out_for_delivery', 'delivered', 'returned'].map(s => (
                                            <option key={s} value={s} className="bg-[#111]">{STATUS_CONFIG[s]?.label || s}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={applyStatusChange}
                                    disabled={updating || newStatus === order.order_status}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-40"
                                >
                                    {updating ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const OrderManager = () => {
    const [allOrders, setAllOrders]         = useState([]);
    const [loading, setLoading]             = useState(true);
    const [search, setSearch]               = useState('');
    const [activeTab, setActiveTab]         = useState('new');
    const [viewOrder, setViewOrder]         = useState(null);
    const [pickupLocations, setPickupLocations] = useState([]);
    const [stats, setStats]                 = useState({});
    const [error, setError]                 = useState('');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = { limit: 500 };
            if (search) params.search = search;
            const res = await orderAPI.getAll(params);
            if (res.success) {
                setAllOrders(res.data || []);
                setStats({ total: res.total || 0, revenue: res.revenue || 0 });
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load orders. Check your API connection.');
        }
        setLoading(false);
    }, [search]);

    const fetchPickupLocations = async () => {
        try {
            const res = await pickupLocationsAPI.getAll();
            if (res.success) setPickupLocations(res.data || []);
        } catch {}
    };

    useEffect(() => {
        fetchPickupLocations();
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchOrders, 300);
        return () => clearTimeout(t);
    }, [fetchOrders]);

    // Apply tab filter
    const currentTab  = TABS.find(t => t.id === activeTab);
    const tabOrders   = allOrders.filter(currentTab?.filter || (() => true));

    // Tab counts
    const tabCounts = TABS.reduce((acc, tab) => {
        acc[tab.id] = allOrders.filter(tab.filter).length;
        return acc;
    }, {});

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Orders & Fulfillment</h1>
                    <p className="text-white/40 text-sm">
                        {stats.total || 0} total · Revenue ₹{parseFloat(stats.revenue || 0).toLocaleString('en-IN')}
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl text-white/60 text-xs uppercase tracking-wider font-bold transition-all disabled:opacity-50"
                >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Fulfilment Flow Banner */}
            <div className="mb-6 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-2xl px-5 py-4">
                <p className="text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-2">Fulfilment Flow</p>
                <div className="flex items-center gap-1 flex-wrap text-xs text-white/50">
                    {['Payment Confirmed', 'Admin Prepares', 'Mark "Ready" + Pickup Location', 'Shiprocket Picks Up', 'Delivered'].map((step, i, arr) => (
                        <React.Fragment key={step}>
                            <span className="whitespace-nowrap">{step}</span>
                            {i < arr.length - 1 && <ChevronRight size={12} className="text-white/20 flex-shrink-0" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                    <AlertTriangle size={14} /> {error}
                </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by order #, customer name or email…"
                    className="w-full sm:w-80 pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A059]/50"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 flex-wrap mb-5 border-b border-white/8 pb-0">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                            activeTab === tab.id
                                ? 'text-[#C5A059] border-[#C5A059] bg-[#C5A059]/5'
                                : 'text-white/40 border-transparent hover:text-white/70'
                        }`}
                    >
                        <tab.icon size={13} />
                        {tab.label}
                        {tabCounts[tab.id] > 0 && (
                            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold ${
                                activeTab === tab.id ? 'bg-[#C5A059] text-black' : 'bg-white/10 text-white/50'
                            }`}>
                                {tabCounts[tab.id]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C5A059]" size={28} /></div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/8">
                                {['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-white/40 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tabOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-white/25 py-14">
                                        <Package size={32} className="mx-auto mb-3 opacity-20" />
                                        No orders in this category
                                    </td>
                                </tr>
                            ) : tabOrders.map(o => (
                                <tr
                                    key={o.id}
                                    onClick={() => setViewOrder(o)}
                                    className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                                >
                                    <td className="px-4 py-3 font-mono text-[#C5A059] font-bold text-xs whitespace-nowrap">{o.order_number}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-white font-medium text-sm whitespace-nowrap">{o.customer_name}</p>
                                        <p className="text-white/40 text-xs">{o.customer_email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-white font-bold whitespace-nowrap">₹{parseFloat(o.total).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3"><Badge value={o.payment_status} config={PAYMENT_CONFIG} /></td>
                                    <td className="px-4 py-3"><Badge value={o.order_status}   config={STATUS_CONFIG} /></td>
                                    <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                                        {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                    </td>
                                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => setViewOrder(o)}
                                            className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <Eye size={12} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {viewOrder && (
                    <OrderDetailModal
                        key={viewOrder.id}
                        order={viewOrder}
                        pickupLocations={pickupLocations}
                        onClose={() => setViewOrder(null)}
                        onRefresh={fetchOrders}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManager;

import React, { useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, X, Loader2, CheckCircle, Package } from 'lucide-react';
import { orderAPI, payuAPI, normalizeAssetUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';

const InputField = ({ label, id, type = 'text', required, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
            id={id}
            type={type}
            required={required}
            className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all"
            {...props}
        />
    </div>
);

const CheckoutPage = ({ onBack }) => {
    const { items, cartTotal, clearCart } = useCart();
    const payuFormRef = useRef(null);

    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        line1: '', line2: '', city: '', state: '', pincode: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [payuFields, setPayuFields] = useState(null);
    const [payuUrl, setPayuUrl] = useState('');

    const discountAmount = 0;
    const shippingCharge = cartTotal >= 999 ? 0 : 99;
    const total = Math.max(0, cartTotal + shippingCharge);

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) { setError('Your cart is empty'); return; }
        setSubmitting(true);
        setError('');
        try {
            // 1. Create order
            const orderPayload = {
                customer_name: form.name,
                customer_email: form.email,
                customer_phone: form.phone,
                shipping_address: {
                    line1: form.line1, line2: form.line2,
                    city: form.city, state: form.state, pincode: form.pincode,
                },
                items: items.map(({ product, qty }) => ({ product_id: product.id, qty })),
                coupon_code: null,
                notes: '',
            };
            const orderRes = await orderAPI.create(orderPayload);
            if (!orderRes.success) throw new Error(orderRes.message);

            const orderId = orderRes.data.id;

            // 2. Initiate PayU payment
            const payuRes = await payuAPI.initiate(orderId);
            if (!payuRes.success) throw new Error(payuRes.message);

            setPayuFields(payuRes.data.payuData);
            setPayuUrl(payuRes.data.payuUrl);

            // 3. Auto-submit the hidden PayU form
            setTimeout(() => { payuFormRef.current?.submit(); }, 200);

        } catch (err) {
            setError(err.message || 'Failed to initiate payment. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16">
            <BackButton onBack={onBack} />
            {/* Hidden PayU Form — auto-submitted */}
            {payuFields && (
                <form ref={payuFormRef} action={payuUrl} method="POST" style={{ display: 'none' }}>
                    {Object.entries(payuFields).map(([k, v]) => (
                        <input key={k} type="hidden" name={k} value={v} />
                    ))}
                </form>
            )}

            <div className="max-w-5xl mx-auto px-6">
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-stone-400 hover:text-[#C5A059] transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
                </button>

                <h1 className="text-2xl font-bold text-stone-900 uppercase tracking-widest mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-[1fr_380px] gap-8">

                        {/* ── Left: Customer + Shipping ── */}
                        <div className="space-y-8">
                            {/* Customer Info */}
                            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                                <h2 className="font-bold text-stone-800 uppercase tracking-widest text-sm mb-5">Contact Information</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <InputField label="Full Name" id="name" value={form.name} onChange={set('name')} required placeholder="Raju Sharma" />
                                    </div>
                                    <InputField label="Email" id="email" type="email" value={form.email} onChange={set('email')} required placeholder="raju@example.com" />
                                    <InputField label="Phone" id="phone" type="tel" value={form.phone} onChange={set('phone')} required placeholder="+91 98765 43210" />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                                <h2 className="font-bold text-stone-800 uppercase tracking-widest text-sm mb-5">Shipping Address</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <InputField label="Address Line 1" id="line1" value={form.line1} onChange={set('line1')} required placeholder="House / Building number, Street" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <InputField label="Address Line 2" id="line2" value={form.line2} onChange={set('line2')} placeholder="Area, Landmark (optional)" />
                                    </div>
                                    <InputField label="City" id="city" value={form.city} onChange={set('city')} required placeholder="Hyderabad" />
                                    <InputField label="State" id="state" value={form.state} onChange={set('state')} required placeholder="Telangana" />
                                    <InputField label="Pincode" id="pincode" value={form.pincode} onChange={set('pincode')} required placeholder="500001" />
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Order Summary ── */}
                        <div className="space-y-5">
                            {/* Items */}
                            <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
                                <h2 className="font-bold text-stone-800 uppercase tracking-widest text-sm mb-4">Order Summary</h2>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                    {items.map(({ product, qty }) => {
                                        const price = parseFloat(product.sale_price || product.price);
                                        const img = normalizeAssetUrl(product.cover_image);
                                        return (
                                            <div key={product.id} className="flex gap-3 items-center group">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                                    <img src={img} alt={product.name} className="w-full h-full object-cover"
                                                        onError={e => { e.target.onerror = null; e.target.src = ''; }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-stone-800 line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-stone-400">Qty: {qty}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <p className="text-xs font-bold text-stone-900 flex-shrink-0">₹{(price * qty).toLocaleString('en-IN')}</p>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeFromCart(product.id)}
                                                        className="text-stone-300 hover:text-red-500 transition-colors"
                                                        title="Remove item"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm space-y-3">
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
                                    <span className="text-[#C5A059]">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting || items.length === 0}
                                className="w-full flex items-center justify-center gap-3 bg-[#C5A059] hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-black font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all duration-200"
                            >
                                {submitting ? (
                                    <><Loader2 size={18} className="animate-spin" /> Redirecting to Payment...</>
                                ) : (
                                    <><Package size={18} /> Pay ₹{total.toLocaleString('en-IN')}</>
                                )}
                            </button>

                            <p className="text-center text-xs text-stone-400">
                                🔒 Secured by PayU · Powered by Shiprocket shipping
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;

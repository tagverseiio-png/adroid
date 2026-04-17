import React, { useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Tag, X, Loader2, Package, MapPin, ChevronDown, CheckCircle2, Truck } from 'lucide-react';
import { orderAPI, payuAPI, couponAPI, normalizeAssetUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';

// ── Indian States list ────────────────────────────────────────────────────────
const INDIAN_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
    'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
    'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
    'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

// ── FREE shipping threshold ───────────────────────────────────────────────────
const FREE_SHIPPING_ABOVE = 999;
const FLAT_SHIPPING        = 99;

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidPincode = (p) => /^[1-9][0-9]{5}$/.test((p || '').trim());
const isAddressComplete = (f) =>
    f.line1.trim() && f.city.trim() && f.state && isValidPincode(f.pincode);

// ── Sub-components ────────────────────────────────────────────────────────────
const InputField = ({ label, id, type = 'text', required, hint, ...props }) => (
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
        {hint && <p className="text-[10px] text-stone-400 mt-1">{hint}</p>}
    </div>
);

// ── Shipping indicator component ──────────────────────────────────────────────
const ShippingBadge = ({ cartTotal, addressComplete, pincode }) => {
    if (!pincode) {
        return (
            <span className="text-stone-400 text-xs flex items-center gap-1">
                <MapPin size={10} /> Enter address
            </span>
        );
    }
    if (!isValidPincode(pincode)) {
        return <span className="text-red-400 text-xs">Invalid pincode</span>;
    }
    if (!addressComplete) {
        return <span className="text-stone-400 text-xs">Complete address</span>;
    }
    if (cartTotal >= FREE_SHIPPING_ABOVE) {
        return <span className="text-emerald-600 font-semibold text-sm">FREE 🎉</span>;
    }
    return <span className="text-stone-700 font-medium text-sm">₹{FLAT_SHIPPING}</span>;
};

// ── Main Component ────────────────────────────────────────────────────────────
const CheckoutPage = ({ onBack }) => {
    const { items, cartTotal, clearCart, removeFromCart } = useCart();
    const payuFormRef = useRef(null);

    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        line1: '', line2: '', city: '', state: '', pincode: '',
    });
    const [couponCode, setCouponCode]       = useState('');
    const [couponApplied, setCouponApplied] = useState(null); // { code, discount }
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError]     = useState('');
    const [submitting, setSubmitting]       = useState(false);
    const [error, setError]                 = useState('');
    const [payuFields, setPayuFields]       = useState(null);
    const [payuUrl, setPayuUrl]             = useState('');

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    // ── Shipping calculation ──────────────────────────────────────────────────
    const addressComplete  = isAddressComplete(form);
    const discountAmount   = couponApplied?.discount || 0;
    const effectiveTotal   = cartTotal - discountAmount;

    // Shipping is only charged once address is confirmed + valid
    const shippingCharge = !addressComplete
        ? null  // null = not yet known
        : effectiveTotal >= FREE_SHIPPING_ABOVE ? 0 : FLAT_SHIPPING;

    const displayTotal = shippingCharge === null
        ? cartTotal - discountAmount         // show without shipping until address entered
        : Math.max(0, effectiveTotal + shippingCharge);

    // ── Coupon ────────────────────────────────────────────────────────────────
    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await couponAPI.validate(couponCode.trim(), cartTotal);
            if (res.success) {
                setCouponApplied({ code: res.data.code, discount: res.data.discount });
                setCouponError('');
            } else {
                setCouponError(res.message || 'Invalid coupon');
            }
        } catch (err) {
            setCouponError(err.message || 'Failed to validate coupon');
        }
        setCouponLoading(false);
    };

    const removeCoupon = () => { setCouponApplied(null); setCouponCode(''); setCouponError(''); };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) { setError('Your cart is empty'); return; }
        if (!addressComplete)  { setError('Please complete your delivery address'); return; }

        setSubmitting(true);
        setError('');
        try {
            const orderPayload = {
                customer_name:    form.name,
                customer_email:   form.email,
                customer_phone:   form.phone,
                shipping_address: {
                    line1:   form.line1,
                    line2:   form.line2,
                    city:    form.city,
                    state:   form.state,
                    pincode: form.pincode,
                },
                items:       items.map(({ product, qty }) => ({ product_id: product.id, qty })),
                coupon_code: couponApplied?.code || null,
                notes:       '',
            };

            const orderRes = await orderAPI.create(orderPayload);
            if (!orderRes.success) throw new Error(orderRes.message);

            const payuRes = await payuAPI.initiate(orderRes.data.id);
            if (!payuRes.success) throw new Error(payuRes.message);

            setPayuFields(payuRes.data.payuData);
            setPayuUrl(payuRes.data.payuUrl);
            setTimeout(() => { payuFormRef.current?.submit(); }, 200);

        } catch (err) {
            setError(err.message || 'Failed to initiate payment. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16">
            <BackButton onBack={onBack} />

            {/* Hidden PayU Form */}
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

                        {/* ── Left: Customer + Address ── */}
                        <div className="space-y-6">

                            {/* Contact */}
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

                            {/* Delivery Address */}
                            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-bold text-stone-800 uppercase tracking-widest text-sm flex items-center gap-2">
                                        <Truck size={14} className="text-[#C5A059]" /> Delivery Address
                                    </h2>
                                    {addressComplete && (
                                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                            <CheckCircle2 size={12} /> Address confirmed
                                        </span>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <InputField label="Address Line 1" id="line1" value={form.line1} onChange={set('line1')} required placeholder="House / Flat number, Street name" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <InputField label="Address Line 2" id="line2" value={form.line2} onChange={set('line2')} placeholder="Area, Landmark (optional)" />
                                    </div>
                                    <InputField label="City" id="city" value={form.city} onChange={set('city')} required placeholder="Chennai" />

                                    {/* State dropdown */}
                                    <div>
                                        <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                            State <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="state"
                                                value={form.state}
                                                onChange={set('state')}
                                                required
                                                className="w-full appearance-none px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all pr-10"
                                            >
                                                <option value="">Select state</option>
                                                {INDIAN_STATES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <InputField
                                        label="Pincode"
                                        id="pincode"
                                        value={form.pincode}
                                        onChange={set('pincode')}
                                        required
                                        placeholder="600001"
                                        maxLength={6}
                                        hint={form.pincode && !isValidPincode(form.pincode) ? '⚠️ Enter a valid 6-digit pincode' : ''}
                                    />
                                </div>

                                {/* Shipping preview inside address card */}
                                {form.pincode.length >= 1 && (
                                    <div className={`mt-4 flex items-center justify-between rounded-xl px-4 py-3 text-sm border transition-all ${
                                        addressComplete
                                            ? shippingCharge === 0
                                                ? 'bg-emerald-50 border-emerald-200'
                                                : 'bg-amber-50 border-amber-200'
                                            : 'bg-stone-50 border-stone-200'
                                    }`}>
                                        <span className="flex items-center gap-2 text-stone-600">
                                            <Truck size={13} />
                                            {addressComplete
                                                ? shippingCharge === 0
                                                    ? 'You qualify for FREE shipping!'
                                                    : `Shipping to ${form.city}, ${form.pincode}`
                                                : 'Complete address to see delivery fee'}
                                        </span>
                                        <ShippingBadge
                                            cartTotal={effectiveTotal}
                                            addressComplete={addressComplete}
                                            pincode={form.pincode}
                                        />
                                    </div>
                                )}

                                {/* Free shipping upsell */}
                                {addressComplete && shippingCharge > 0 && effectiveTotal < FREE_SHIPPING_ABOVE && (
                                    <div className="mt-3 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5">
                                        💡 Add <strong className="text-stone-700">₹{(FREE_SHIPPING_ABOVE - effectiveTotal).toLocaleString('en-IN')}</strong> more to get FREE shipping
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Right: Order Summary ── */}
                        <div className="space-y-4">

                            {/* Items */}
                            <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
                                <h2 className="font-bold text-stone-800 uppercase tracking-widest text-sm mb-4">Order Summary</h2>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                    {items.map(({ product, qty }) => {
                                        const price = parseFloat(product.sale_price || product.price);
                                        const img   = normalizeAssetUrl(product.cover_image);
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
                            <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm space-y-3 text-sm">
                                <div className="flex justify-between text-stone-500">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>

                                {couponApplied && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Coupon ({couponApplied.code})</span>
                                        <span>−₹{couponApplied.discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-stone-500 items-center">
                                    <span>Shipping</span>
                                    <ShippingBadge
                                        cartTotal={effectiveTotal}
                                        addressComplete={addressComplete}
                                        pincode={form.pincode}
                                    />
                                </div>

                                <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-100">
                                    <span>Total</span>
                                    <span className="text-[#C5A059]">
                                        ₹{displayTotal.toLocaleString('en-IN')}
                                        {shippingCharge === null && <span className="text-xs font-normal text-stone-400 ml-1"> + shipping</span>}
                                    </span>
                                </div>
                            </div>

                            {/* Coupon */}
                            {!couponApplied ? (
                                <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                                placeholder="Coupon code"
                                                className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059] transition-all"
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            disabled={couponLoading || !couponCode.trim()}
                                            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-40"
                                        >
                                            {couponLoading ? <Loader2 size={13} className="animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center justify-between">
                                    <span className="text-emerald-700 text-sm font-medium flex items-center gap-2">
                                        <Tag size={13} /> {couponApplied.code} − ₹{couponApplied.discount.toLocaleString('en-IN')} off
                                    </span>
                                    <button type="button" onClick={removeCoupon} className="text-stone-400 hover:text-red-500 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting || items.length === 0 || !addressComplete}
                                className="w-full flex items-center justify-center gap-3 bg-[#C5A059] hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-black font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all duration-200"
                            >
                                {submitting ? (
                                    <><Loader2 size={18} className="animate-spin" /> Redirecting to Payment...</>
                                ) : !addressComplete ? (
                                    <><MapPin size={18} /> Complete Address to Continue</>
                                ) : (
                                    <><Package size={18} /> Pay ₹{displayTotal.toLocaleString('en-IN')}</>
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

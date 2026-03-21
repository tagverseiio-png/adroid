import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Loader2, Tag } from 'lucide-react';
import { couponAPI } from '../../services/api';

const CouponManager = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editCoupon, setEditCoupon] = useState(null);
    const [saving, setSaving] = useState(false);

    const emptyForm = { code: '', type: 'percent', value: '', min_order_value: '', max_discount: '', max_uses: '', active: true, expiry_date: '', description: '' };
    const [form, setForm] = useState(emptyForm);

    const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const fetchCoupons = useCallback(async () => {
        setLoading(true);
        try {
            const res = await couponAPI.getAll();
            if (res.success) setCoupons(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

    const openAdd = () => { setForm(emptyForm); setEditCoupon(null); setShowForm(true); };
    const openEdit = (c) => {
        setForm({
            ...c,
            expiry_date: c.expiry_date ? new Date(c.expiry_date).toISOString().slice(0, 16) : '',
        });
        setEditCoupon(c);
        setShowForm(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                value: parseFloat(form.value),
                min_order_value: parseFloat(form.min_order_value || 0),
                max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
                max_uses: parseInt(form.max_uses || 0),
                expiry_date: form.expiry_date || null,
            };
            if (editCoupon) {
                await couponAPI.update(editCoupon.id, payload);
            } else {
                await couponAPI.create(payload);
            }
            await fetchCoupons();
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to save coupon');
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        await couponAPI.delete(id);
        setCoupons(c => c.filter(x => x.id !== id));
    };

    const isExpired = (c) => c.expiry_date && new Date(c.expiry_date) < new Date();

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Coupons</h1>
                    <p className="text-white/40 text-sm">{coupons.length} coupon codes</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-[#C5A059] hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                    <Plus size={14} /> Add Coupon
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C5A059]" size={28} /></div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/8">
                                {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expiry', 'Status', ''].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.length === 0 ? (
                                <tr><td colSpan={8} className="text-center text-white/30 py-12">No coupons yet</td></tr>
                            ) : coupons.map(c => (
                                <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                    <td className="px-4 py-3 font-mono font-bold text-[#C5A059] text-sm">{c.code}</td>
                                    <td className="px-4 py-3 text-white/60 capitalize">{c.type}</td>
                                    <td className="px-4 py-3 text-white font-bold">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                                    <td className="px-4 py-3 text-white/50">₹{parseFloat(c.min_order_value || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-4 py-3 text-white/50">{c.used_count}/{c.max_uses || '∞'}</td>
                                    <td className="px-4 py-3 text-white/50 text-xs">{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            isExpired(c) ? 'bg-red-400/10 text-red-400' :
                                            !c.active ? 'bg-white/10 text-white/40' :
                                            'bg-emerald-400/10 text-emerald-400'
                                        }`}>
                                            {isExpired(c) ? 'Expired' : c.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 justify-end">
                                            <button onClick={() => openEdit(c)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Edit2 size={13} /></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="text-white font-bold">{editCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Code *</label>
                                    <input value={form.code} onChange={set('code')} placeholder="e.g. SAVE10" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono uppercase focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Type *</label>
                                    <select value={form.type} onChange={set('type')} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50">
                                        <option value="percent">Percent (%)</option>
                                        <option value="flat">Flat (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Value *</label>
                                    <input type="number" value={form.value} onChange={set('value')} placeholder={form.type === 'percent' ? '10' : '100'} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Min Order (₹)</label>
                                    <input type="number" value={form.min_order_value} onChange={set('min_order_value')} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Max Discount (₹)</label>
                                    <input type="number" value={form.max_discount} onChange={set('max_discount')} placeholder="Optional" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Max Uses (0 = unlimited)</label>
                                    <input type="number" value={form.max_uses} onChange={set('max_uses')} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Expiry Date</label>
                                    <input type="datetime-local" value={form.expiry_date} onChange={set('expiry_date')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Description</label>
                                    <input value={form.description} onChange={set('description')} placeholder="Optional note" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.active} onChange={set('active')} className="w-4 h-4 rounded accent-[#C5A059]" />
                                    <span className="text-white/70 text-sm">Active</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 pb-6">
                            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-white/40 hover:text-white text-sm font-bold">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#C5A059] hover:bg-amber-400 disabled:bg-stone-600 text-black px-6 py-2.5 rounded-xl font-bold text-sm">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CouponManager;

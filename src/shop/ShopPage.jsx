import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShoppingBag, ChevronDown, X, Loader2, ShoppingCart } from 'lucide-react';
import { shopAPI, categoriesAPI, normalizeAssetUrl } from '../services/api';
import { useCart } from '../context/CartContext';

const SORT_OPTIONS = [
    { label: 'Newest', value: 'created_at' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Top Rated', value: 'rating' },
];

const StarRating = ({ rating, size = 12 }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={size}
                className={parseFloat(rating) >= s ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-300'}
                strokeWidth={1.5}
            />
        ))}
    </div>
);

const ProductCard = ({ product, onView, onAddToCart }) => {
    const price = parseFloat(product.price);
    const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
    const coverImg = normalizeAssetUrl(product.cover_image);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-stone-100"
        >
            {/* Image */}
            <div
                className="relative aspect-[4/3] overflow-hidden bg-stone-100"
                onClick={() => onView(product)}
            >
                {coverImg ? (
                    <img
                        src={coverImg}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                        <ShoppingBag className="text-stone-400 w-12 h-12" strokeWidth={1} />
                    </div>
                )}
                {salePrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Sale
                    </div>
                )}
                {product.featured && (
                    <div className="absolute top-3 right-3 bg-[#C5A059] text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Featured
                    </div>
                )}
                {product.stock_qty === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-bold uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-[10px] text-[#C5A059] uppercase tracking-widest font-medium mb-1">{product.category_name || 'General'}</p>
                <h3
                    className="font-bold text-stone-800 text-sm leading-snug line-clamp-2 hover:text-[#C5A059] transition-colors cursor-pointer mb-2"
                    onClick={() => onView(product)}
                >
                    {product.name}
                </h3>

                {parseFloat(product.average_rating) > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={product.average_rating} />
                        <span className="text-xs text-stone-400">({product.review_count})</span>
                    </div>
                )}

                <div className="flex items-center justify-between mt-3">
                    <div>
                        {salePrice ? (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-stone-900">₹{salePrice.toLocaleString('en-IN')}</span>
                                <span className="text-sm text-stone-400 line-through">₹{price.toLocaleString('en-IN')}</span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-stone-900">₹{price.toLocaleString('en-IN')}</span>
                        )}
                    </div>
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock_qty === 0}
                        className="bg-[#C5A059] hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-black text-[10px] font-bold uppercase px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5"
                    >
                        <ShoppingCart size={12} /> Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ShopPage = ({ onViewProduct }) => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sort, setSort] = useState('created_at');
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 24;

    useEffect(() => {
        categoriesAPI.getAll().then(res => {
            if (res.success) setCategories(res.data);
        }).catch(console.error);
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = { sort, page, limit: LIMIT };
            if (search) params.search = search;
            if (selectedCategory) params.category = selectedCategory;
            if (minPrice) params.min_price = minPrice;
            if (maxPrice) params.max_price = maxPrice;

            const res = await shopAPI.getAll(params);
            if (res.success) {
                setProducts(res.data);
                setTotal(res.total);
            }
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    }, [search, selectedCategory, sort, page, minPrice, maxPrice]);

    useEffect(() => {
        const timeout = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeout);
    }, [fetchProducts]);

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="min-h-screen bg-stone-50">
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <div className="bg-[#0a0a0a] pt-32 pb-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[#C5A059] text-xs font-mono tracking-[0.3em] uppercase mb-4">Adroit Design Studio</p>
                    <h1 className="text-4xl md:text-6xl font-logo text-white uppercase tracking-widest mb-6">
                        Shop
                    </h1>
                    <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
                        Curated furniture, décor, and design objects — crafted for spaces that inspire.
                    </p>
                </div>
            </div>

            {/* ── Category Pills ─────────────────────────────────────────── */}
            <div className="bg-white border-b border-stone-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => { setSelectedCategory(''); setPage(1); }}
                        className={`flex-shrink-0 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${!selectedCategory ? 'bg-[#C5A059] text-black' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                            className={`flex-shrink-0 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${selectedCategory === cat.slug ? 'bg-[#C5A059] text-black' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Toolbar ───────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search products..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 focus:border-[#C5A059]"
                    />
                    {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"><X size={14} /></button>}
                </div>

                {/* Sort */}
                <div className="relative">
                    <select
                        value={sort}
                        onChange={e => { setSort(e.target.value); setPage(1); }}
                        className="appearance-none pl-4 pr-8 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 cursor-pointer"
                    >
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all ${showFilters ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'bg-white border-stone-200 text-stone-600 hover:border-[#C5A059]'}`}
                >
                    <SlidersHorizontal size={14} /> Filters
                </button>

                <div className="ml-auto text-xs text-stone-400">{total} product{total !== 1 ? 's' : ''}</div>
            </div>

            {/* ── Price Filter ──────────────────────────────────────────── */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white border-y border-stone-100"
                    >
                        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Price Range</span>
                            <input
                                type="number" placeholder="Min ₹"
                                value={minPrice}
                                onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                                className="w-28 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30"
                            />
                            <span className="text-stone-400">—</span>
                            <input
                                type="number" placeholder="Max ₹"
                                value={maxPrice}
                                onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                                className="w-28 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30"
                            />
                            {(minPrice || maxPrice) && (
                                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                                    <X size={12} /> Clear
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Product Grid ──────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="animate-spin text-[#C5A059]" size={32} />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <ShoppingBag className="mx-auto mb-4 text-stone-300" size={48} strokeWidth={1} />
                        <p className="text-stone-400 font-medium">No products found</p>
                        <p className="text-stone-300 text-sm mt-1">Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map(p => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onView={onViewProduct}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-bold bg-white border border-stone-200 rounded-xl disabled:opacity-40 hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const p = Math.min(Math.max(page - 2, 1), totalPages - 4) + i;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-10 h-10 text-sm font-bold rounded-xl transition-all ${page === p ? 'bg-[#C5A059] text-black' : 'bg-white border border-stone-200 hover:border-[#C5A059]'}`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm font-bold bg-white border border-stone-200 rounded-xl disabled:opacity-40 hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPage;

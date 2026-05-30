import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Package, Minus, Plus, Share2, ChevronLeft, ChevronRight, Loader2, Copy, Check, MessageCircle, Mail } from 'lucide-react';
import { shopAPI, normalizeAssetUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import BackButton from '../components/BackButton';

const StarRating = ({ rating, size = 14 }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={size}
                className={parseFloat(rating) >= s ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-300'}
                strokeWidth={1.5}
            />
        ))}
    </div>
);

const ProductDetail = ({ product: initialProduct, onBack, onGoToCheckout }) => {
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const [shareMenuOpen, setShareMenuOpen] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    useEffect(() => {
        const slug = initialProduct?.slug || initialProduct?.id;
        if (!slug) return;
        setLoading(true);
        shopAPI.getBySlug(slug)
            .then(res => {
                if (res.success) setProduct(res.data);
            })
            .catch(() => setProduct(initialProduct))
            .finally(() => setLoading(false));
    }, [initialProduct]);

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (shareMenuOpen && !e.target.closest('[data-share-menu]')) {
                setShareMenuOpen(false);
            }
        };
        if (shareMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [shareMenuOpen]);

    if (loading) return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-24">
            <Loader2 className="animate-spin text-[#C5A059]" size={32} />
        </div>
    );

    if (!product) return null;

    const allImages = [
        ...(product.cover_image ? [product.cover_image] : []),
        ...(product.images || []).filter(img => img !== product.cover_image)
    ].map(normalizeAssetUrl).filter(Boolean);

    const price = parseFloat(product.price);
    const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
    const displayPrice = salePrice || price;
    const specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : (product.specifications || {});

    const handleAddToCart = () => {
        addToCart(product, qty);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, qty);
        onGoToCheckout();
    };

    const getShareUrl = () => {
        const slug = product?.slug || product?.id;
        return `${window.location.origin}/shop/product/${slug}`;
    };

    const handleCopyLink = () => {
        const url = getShareUrl();
        navigator.clipboard.writeText(url).then(() => {
            setCopiedToClipboard(true);
            setTimeout(() => setCopiedToClipboard(false), 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedToClipboard(true);
            setTimeout(() => setCopiedToClipboard(false), 2000);
        });
    };

    const handleShareSocial = (platform) => {
        const url = getShareUrl();
        const text = `Check out ${product.name} at ${product.shop_name || 'our shop'}!`;
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        const shareLinks = {
            whatsapp: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            email: `mailto:?subject=${encodedText}&body=${encodedUrl}`
        };
        if (shareLinks[platform]) {
            window.open(shareLinks[platform], '_blank', 'width=600,height=400');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <BackButton onBack={onBack} />
            <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">

                {/* Breadcrumb */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-stone-400 hover:text-[#C5A059] transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
                </button>

                {/* Product Layout */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* ── Image Gallery ── */}
                    <div>
                        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm mb-4 border border-stone-100">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    src={allImages[activeImg] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'; }}
                                />
                            </AnimatePresence>
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md transition-all"
                                    ><ChevronLeft size={18} /></button>
                                    <button
                                        onClick={() => setActiveImg(i => (i + 1) % allImages.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md transition-all"
                                    ><ChevronRight size={18} /></button>
                                </>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(idx)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-[#C5A059]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.onerror = null; }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Product Info ── */}
                    <div>
                        <p className="text-[#C5A059] text-xs font-mono tracking-[0.3em] uppercase mb-2">{product.category_name}</p>
                        <h1 className="text-3xl font-bold text-stone-900 leading-tight mb-2">{product.name}</h1>
                        {product.sku && <p className="text-xs text-stone-400 mb-4">SKU: {product.sku}</p>}

                        {/* Rating */}
                        {parseFloat(product.average_rating) > 0 && (
                            <div className="flex items-center gap-3 mb-4">
                                <StarRating rating={product.average_rating} />
                                <span className="text-sm text-stone-500">{parseFloat(product.average_rating).toFixed(1)} ({product.review_count} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="mb-6">
                            {salePrice ? (
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-stone-900">₹{salePrice.toLocaleString('en-IN')}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-lg text-stone-400 line-through">₹{price.toLocaleString('en-IN')}</span>
                                        <span className="text-sm font-bold text-red-500">
                                            {Math.round((1 - salePrice / price) * 100)}% OFF
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-3xl font-bold text-stone-900">₹{price.toLocaleString('en-IN')}</span>
                            )}
                            <p className="text-xs text-stone-400 mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-stone-600 text-sm leading-relaxed mb-6">{product.short_description}</p>
                        )}

                        {/* Stock Indicator */}
                        <div className={`flex items-center gap-2 text-sm font-medium mb-6 ${product.stock_qty > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            <Package size={15} />
                            {product.stock_qty > 5 ? 'In Stock' : product.stock_qty > 0 ? `Only ${product.stock_qty} left!` : 'Out of Stock'}
                        </div>

                        {/* Qty + Buttons */}
                        {product.stock_qty > 0 && (
                            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-stone-50 transition-colors"><Minus size={14} /></button>
                                    <span className="px-5 text-sm font-bold">{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.stock_qty, q + 1))} className="px-4 py-3 hover:bg-stone-50 transition-colors"><Plus size={14} /></button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${addedFeedback ? 'bg-emerald-500 text-white' : 'bg-[#C5A059] hover:bg-amber-600 text-black'}`}
                                >
                                    <ShoppingCart size={16} />
                                    {addedFeedback ? 'Added!' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider bg-stone-900 hover:bg-stone-700 text-white transition-all"
                                >
                                    Buy Now
                                </button>
                            </div>
                        )}

                        {/* Share Button */}
                        <div className="relative mb-6" data-share-menu>
                            <button
                                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider border-2 border-stone-200 hover:border-[#C5A059] text-stone-700 hover:text-[#C5A059] transition-all"
                            >
                                <Share2 size={16} />
                                Share Product
                            </button>

                            {/* Share Menu */}
                            {shareMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-50"
                                >
                                    {/* Copy Link */}
                                    <button
                                        onClick={handleCopyLink}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left text-sm"
                                    >
                                        {copiedToClipboard ? (
                                            <>
                                                <Check size={16} className="text-emerald-500" />
                                                <span className="text-emerald-500 font-medium">Link Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} className="text-stone-600" />
                                                <span className="text-stone-700">Copy Link</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="border-t border-stone-100" />

                                    {/* Social Share Options */}
                                    <button
                                        onClick={() => { handleShareSocial('whatsapp'); setShareMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left text-sm"
                                    >
                                        <MessageCircle size={16} className="text-green-500" />
                                        <span className="text-stone-700">Share on WhatsApp</span>
                                    </button>

                                    <button
                                        onClick={() => { handleShareSocial('facebook'); setShareMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left text-sm border-t border-stone-100"
                                    >
                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                        <span className="text-stone-700">Share on Facebook</span>
                                    </button>

                                    <button
                                        onClick={() => { handleShareSocial('twitter'); setShareMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left text-sm border-t border-stone-100"
                                    >
                                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.866.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                        <span className="text-stone-700">Share on Twitter</span>
                                    </button>

                                    <button
                                        onClick={() => { handleShareSocial('linkedin'); setShareMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left text-sm border-t border-stone-100"
                                    >
                                        <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                                        <span className="text-stone-700">Share on LinkedIn</span>
                                    </button>

                                    <button
                                        onClick={() => { handleShareSocial('email'); setShareMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left text-sm border-t border-stone-100"
                                    >
                                        <Mail size={16} className="text-orange-500" />
                                        <span className="text-stone-700">Share via Email</span>
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {product.tags.map(tag => (
                                    <span key={tag} className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                        )}

                        {/* Shipping note */}
                        <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl p-4 text-sm text-stone-600">
                            🚚 <strong>Free shipping</strong> on orders above ₹999 · Shipped via Shiprocket
                        </div>
                    </div>
                </div>

                {/* ── Full Description + Specifications ── */}
                <div className="mt-16 grid md:grid-cols-2 gap-10">
                    {product.description && (
                        <div>
                            <h2 className="text-lg font-bold text-stone-900 uppercase tracking-widest mb-4 pb-3 border-b border-stone-200">Description</h2>
                            <div className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</div>
                        </div>
                    )}
                    {Object.keys(specs).length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-stone-900 uppercase tracking-widest mb-4 pb-3 border-b border-stone-200">Specifications</h2>
                            <table className="w-full text-sm">
                                <tbody>
                                    {Object.entries(specs).map(([key, val]) => (
                                        <tr key={key} className="border-b border-stone-100">
                                            <td className="py-2.5 pr-4 text-stone-500 font-medium capitalize w-1/3">{key}</td>
                                            <td className="py-2.5 text-stone-800">{String(val)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ── Reviews ── */}
                {product.reviews?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-lg font-bold text-stone-900 uppercase tracking-widest mb-6 pb-3 border-b border-stone-200">
                            Customer Reviews <span className="text-stone-400 font-normal">({product.reviews.length})</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {product.reviews.map(r => (
                                <div key={r.id} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-stone-800 text-sm">{r.reviewer_name}</p>
                                            <StarRating rating={r.rating} size={12} />
                                        </div>
                                        <p className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString()}</p>
                                    </div>
                                    {r.title && <p className="font-semibold text-stone-700 text-sm mb-1">{r.title}</p>}
                                    <p className="text-stone-600 text-sm leading-relaxed">{r.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Related Products ── */}
                {product.related?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-lg font-bold text-stone-900 uppercase tracking-widest mb-6 pb-3 border-b border-stone-200">You May Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {product.related.map(rp => (
                                <div key={rp.id} className="group bg-white rounded-xl overflow-hidden border border-stone-100 cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => { window.scrollTo(0, 0); }}>
                                    <div className="aspect-square bg-stone-100 overflow-hidden">
                                        <img
                                            src={normalizeAssetUrl(rp.cover_image) || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'}
                                            alt={rp.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'; }}
                                        />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-bold text-stone-800 line-clamp-1">{rp.name}</p>
                                        <p className="text-sm text-[#C5A059] font-bold mt-1">₹{parseFloat(rp.sale_price || rp.price).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;

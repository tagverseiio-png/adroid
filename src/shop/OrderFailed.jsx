import React from 'react';
import { XCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

const OrderFailed = ({ orderNumber, onRetry, onShop }) => (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Payment Failed</h1>
            <p className="text-stone-500 mb-4">Something went wrong with your payment. No charge has been made.</p>
            {orderNumber && (
                <div className="bg-white border border-stone-100 rounded-2xl px-6 py-4 shadow-sm mb-6 inline-block">
                    <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Order Reference</p>
                    <p className="text-base font-bold text-stone-700 font-mono">{orderNumber}</p>
                </div>
            )}
            <p className="text-xs text-stone-400 mb-6">You can retry the payment or contact us for assistance.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-amber-600 text-black text-sm font-bold uppercase tracking-wider rounded-xl transition-all"
                    >
                        <RefreshCcw size={16} /> Retry Payment
                    </button>
                )}
                <button
                    onClick={onShop}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-700 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                    <ArrowLeft size={16} /> Back to Shop
                </button>
            </div>
        </div>
    </div>
);

export default OrderFailed;

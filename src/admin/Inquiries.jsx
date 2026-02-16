import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { inquiriesAPI } from '../services/api';

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await inquiriesAPI.getAll();
            if (response.success) {
                setInquiries(response.data?.inquiries || []);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
            setInquiries([]);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await inquiriesAPI.updateStatus(id, 'Read');
            setInquiries(inquiries.map(item =>
                item.id === id ? { ...item, status: 'Read' } : item
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const deleteInquiry = async (id) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await inquiriesAPI.delete(id);
                setInquiries(inquiries.filter(item => item.id !== id));
                // Reset to first page if current page becomes empty
                const maxPages = Math.ceil((inquiries.length - 1) / itemsPerPage);
                if (currentPage > maxPages && maxPages > 0) {
                    setCurrentPage(maxPages);
                }
            } catch (error) {
                console.error('Failed to delete inquiry:', error);
            }
        }
    };

    // Calculate pagination
    const totalPages = Math.ceil(inquiries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInquiries = inquiries.slice(startIndex, endIndex);

    return (
        <div>
            <h2 className="text-3xl font-serif text-white mb-2">Enquiries</h2>
            <p className="text-white/40 text-sm mb-8">Messages from the contact form. Showing {inquiries.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, inquiries.length)} of {inquiries.length}</p>

            {isLoading ? (
                <div className="text-center text-white/40 py-12">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
                <div className="text-center text-white/40 py-12">No inquiries yet.</div>
            ) : (
                <>
                    <div className="space-y-4">
                        {currentInquiries.map((inquiry) => (
                            <div key={inquiry.id} className={`bg-white/5 border p-6 rounded-xl relative group transition-all ${inquiry.status === 'New' ? 'border-[#C5A059]/50 bg-[#C5A059]/5' : 'border-white/10'}`}>
                                {inquiry.status === "New" && (
                                    <div className="absolute top-6 right-6 px-2 py-1 bg-[#C5A059] text-black text-[10px] font-bold uppercase rounded">New</div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg text-white font-bold">{inquiry.subject}</h3>
                                        <p className="text-[#C5A059] text-xs uppercase tracking-wider mt-1">{inquiry.name}</p>
                                    </div>
                                    <span className="text-white/30 text-xs flex items-center gap-2">
                                        <Calendar size={12} /> {new Date(inquiry.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-white/70 text-sm bg-black/20 p-4 rounded mb-4 font-light">"{inquiry.message}"</p>

                                <div className="flex gap-6 border-t border-white/5 pt-4">
                                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors">
                                        <Mail size={14} /> {inquiry.email}
                                    </a>
                                    <span className="flex items-center gap-2 text-white/40 text-xs">
                                        <Phone size={14} /> {inquiry.phone || 'N/A'}
                                    </span>
                                </div>

                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                                    {inquiry.status === 'New' && (
                                        <button onClick={() => markAsRead(inquiry.id)} className="text-xs uppercase font-bold text-[#C5A059] hover:underline">Mark as Read</button>
                                    )}
                                    <button onClick={() => deleteInquiry(inquiry.id)} className="text-xs uppercase font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 disabled:opacity-50 disabled:cursor-not-allowed text-[#C5A059] rounded-lg transition-colors"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <span className="text-white/60 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 disabled:opacity-50 disabled:cursor-not-allowed text-[#C5A059] rounded-lg transition-colors"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Inquiries;

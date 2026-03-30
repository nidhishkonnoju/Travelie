import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingService from '../services/BookingService';
import { getPackageImage } from '../utils/imageHelper';

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', icon: AlertCircle, color: '#c4a35a' },
    CONFIRMED: { label: 'Confirmed', icon: CheckCircle, color: '#1a1a1a' },
    CANCELLED: { label: 'Cancelled', icon: XCircle, color: '#747878' },
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await BookingService.getMyBookings();
            setBookings(res.data || []);
        } catch (e) {
            console.error('Failed to fetch bookings', e);
        } finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await BookingService.cancel(id);
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
        } catch { alert('Failed to cancel booking.'); }
    };

    const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Your Journeys</span>
                <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">My Bookings.</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-8">
                {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(s => (
                    <button
                        key={s}
                        className={`px-4 py-2 rounded-full border text-xs uppercase tracking-widest font-semibold transition-all ${
                            filter === s 
                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' 
                            : 'border-[#e0e0e0] text-[#747878] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-transparent'
                        }`}
                        onClick={() => setFilter(s)}
                    >
                        {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                    <Package size={48} className="text-[#eeeeee] mb-4" />
                    <h3 className="font-headline text-2xl text-[#1a1a1a] mb-2">No bookings found</h3>
                    <p className="text-[#747878] font-body font-light mb-6">
                        {filter === 'ALL' ? "You haven't made any bookings yet." : `No ${filter.toLowerCase()} bookings.`}
                    </p>
                    <button 
                        onClick={() => navigate('/packages')}
                        className="bg-[#1a1a1a] text-white px-8 py-3 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity"
                    >
                        Explore Packages
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map(booking => {
                        const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                        const StatusIcon = status.icon;
                        return (
                            <div key={booking.id} className="bg-white border border-[#eeeeee] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-[#f3f3f4]">
                                        {getPackageImage(booking.packageTitle) ? (
                                            <img src={getPackageImage(booking.packageTitle)} alt="thumb" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Calendar size={20} className="text-[#747878]" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-body font-semibold text-[#1a1a1a] mb-1">{booking.packageTitle || `Package #${booking.travelPackageId}`}</h3>
                                        <div className="flex flex-wrap gap-4 text-[#747878] text-xs font-body">
                                            <span className="flex items-center gap-1"><Users size={12} />{booking.participants} Traveler{booking.participants > 1 ? 's' : ''}</span>
                                            <span className="flex items-center gap-1"><DollarSign size={12} />${booking.totalAmount}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} />{new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-xs font-body font-semibold" style={{ color: status.color }}>
                                        <StatusIcon size={14} />
                                        {status.label}
                                    </span>
                                    {booking.status === 'PENDING' && (
                                        <button 
                                            onClick={() => handleCancel(booking.id)}
                                            className="px-3 py-1 text-xs font-body text-red-600 border border-red-200 hover:bg-red-50 transition-colors bg-transparent"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default MyBookings;

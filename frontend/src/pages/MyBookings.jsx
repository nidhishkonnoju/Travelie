import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, DollarSign, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';
import BookingService from '../services/BookingService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getPackageImage } from '../utils/imageHelper';

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', icon: AlertCircle, color: '#f59e0b', bg: '#f59e0b20' },
    CONFIRMED: { label: 'Confirmed', icon: CheckCircle, color: '#10b981', bg: '#10b98120' },
    CANCELLED: { label: 'Cancelled', icon: XCircle, color: '#ef4444', bg: '#ef444420' },
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

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

    if (loading) return <div className="text-center mt-3">Loading your bookings...</div>;

    return (
        <div className="bookings-page">
            <div className="page-header mb-3">
                <h2>My Bookings</h2>
                <p className="text-secondary text-small">Track all your travel reservations</p>
            </div>

            <div className="flex gap-2 mb-3">
                {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(s => (
                    <button
                        key={s}
                        className={`btn ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(s)}
                    >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state glass p-3 text-center">
                    <Package size={64} style={{ opacity: 0.2 }} className="mb-2" />
                    <h3>No bookings found</h3>
                    <p className="text-secondary">
                        {filter === 'ALL' ? "You haven't made any bookings yet. Explore our packages!" :
                            `No ${filter.toLowerCase()} bookings.`}
                    </p>
                    <Button variant="primary" className="mt-2" onClick={() => window.location.href = '/packages'}>
                        Explore Packages
                    </Button>
                </div>
            ) : (
                <div className="bookings-list flex-column gap-2">
                    {filtered.map(booking => {
                        const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                        const StatusIcon = status.icon;
                        return (
                            <Card key={booking.id} className="booking-row">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3 items-start">
                                        <div className="booking-package-thumb glass" style={{ overflow: 'hidden', padding: 0 }}>
                                            {getPackageImage(booking.packageTitle) ? (
                                                <img src={getPackageImage(booking.packageTitle)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                                    <Calendar size={24} color="#6366f1" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{booking.packageTitle || `Package #${booking.travelPackageId}`}</h3>
                                            <div className="flex gap-3 text-secondary text-small">
                                                <span className="flex items-center gap-1"><Users size={14} />{booking.participants} Traveler{booking.participants > 1 ? 's' : ''}</span>
                                                <span className="flex items-center gap-1"><DollarSign size={14} />Total: ${booking.totalAmount}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} />
                                                    {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="flex items-center gap-1 px-2 py-1 rounded"
                                            style={{ background: status.bg, color: status.color, fontSize: '0.8rem', fontWeight: 600 }}
                                        >
                                            <StatusIcon size={14} />
                                            {status.label}
                                        </div>
                                        {booking.status === 'PENDING' && (
                                            <Button size="sm" variant="danger" onClick={() => handleCancel(booking.id)}>
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;

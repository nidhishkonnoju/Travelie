import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import PackageService from '../services/PackageService';
import BookingService from '../services/BookingService';

const Booking = () => {
    const { packageId } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [travelerCount, setTravelerCount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchPkg = async () => {
            try {
                const response = await PackageService.getById(packageId);
                setPkg(response.data);
            } catch (error) {
                console.error('Failed to fetch package', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPkg();
    }, [packageId]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        try {
            await BookingService.create({
                packageId: pkg.id,
                travelerCount,
                totalAmount: pkg.price * travelerCount
            });
            setSuccess(true);
        } catch {
            alert('Booking failed. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    if (!pkg) return <div className="min-h-[60vh] flex items-center justify-center"><p className="font-headline text-2xl">Package not found.</p></div>;

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <CheckCircle size={64} className="text-[#1a1a1a] mb-4" />
                <h2 className="font-headline text-4xl tracking-tighter mb-2">Booking Confirmed.</h2>
                <p className="font-body text-[#747878] font-light mb-8">Your request has been sent for confirmation.</p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/bookings')} className="bg-[#1a1a1a] text-white px-8 py-3 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity">
                        View My Bookings
                    </button>
                    <button onClick={() => navigate('/packages')} className="border border-[#1a1a1a] text-[#1a1a1a] px-8 py-3 font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#1a1a1a] hover:text-white transition-all bg-transparent">
                        Explore More
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#747878] hover:text-[#1a1a1a] transition-colors mb-8 bg-transparent font-body text-sm"
            >
                <ArrowLeft size={16} />
                <span>Cancel Booking</span>
            </button>

            <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Checkout</span>
                <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Complete Your Booking.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trip Review */}
                <div className="bg-white border border-[#eeeeee] p-8">
                    <h3 className="font-headline text-2xl tracking-tight mb-6">Review Trip</h3>
                    <p className="font-body font-semibold text-[#1a1a1a] text-lg mb-6">{pkg.title}</p>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-4 border-b border-[#eeeeee]">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Destination</span>
                            <span className="font-body font-medium text-[#1a1a1a]">{pkg.location}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-[#eeeeee]">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Duration</span>
                            <span className="font-body text-[#1a1a1a]">{pkg.durationDays} Days</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Price per Traveler</span>
                            <span className="font-headline text-2xl tracking-tight text-[#1a1a1a]">${pkg.price}</span>
                        </div>
                    </div>
                </div>

                {/* Confirm Booking */}
                <div className="bg-white border border-[#eeeeee] p-8">
                    <h3 className="font-headline text-2xl tracking-tight mb-6">Confirm Booking</h3>
                    <form onSubmit={handleBooking} className="flex flex-col gap-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Number of Travelers</label>
                            <div className="border-b border-[#747878]/30 pb-2">
                                <input 
                                    className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none" 
                                    type="number"
                                    min="1"
                                    max={pkg.availableSlots}
                                    value={travelerCount}
                                    onChange={(e) => setTravelerCount(parseInt(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-[#eeeeee]">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Total Amount</span>
                            <span className="font-headline text-3xl tracking-tight text-[#1a1a1a]">${pkg.price * travelerCount}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={bookingLoading}
                            className="w-full bg-[#1a1a1a] text-white py-3 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 mt-2"
                        >
                            {bookingLoading ? 'Processing...' : 'Confirm & Book'}
                        </button>
                        <p className="text-center font-body text-xs text-[#747878]">No immediate payment required for confirmation.</p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Booking;

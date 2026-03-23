import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import PackageService from '../services/PackageService';
import BookingService from '../services/BookingService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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

    if (loading) return <div className="text-center mt-3">Preparing booking form...</div>;
    if (!pkg) return <div className="text-center mt-3">Package not found.</div>;

    if (success) {
        return (
            <div className="flex-column items-center justify-center mt-3 py-3">
                <CheckCircle size={64} className="text-success mb-2" />
                <h2 className="mb-1">Booking Successful!</h2>
                <p className="text-secondary mb-3">Your request has been sent for confirmation.</p>
                <div className="flex gap-2">
                    <Button variant="primary" onClick={() => navigate('/bookings')}>View My Bookings</Button>
                    <Button variant="secondary" onClick={() => navigate('/')}>Back to Explorer</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <Button
                variant="secondary"
                size="sm"
                icon={ArrowLeft}
                onClick={() => navigate(-1)}
                className="mb-2"
            >
                Cancel Booking
            </Button>

            <div className="grid grid-2-1">
                <Card title="Review Trip" subtitle={pkg.title}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary">Destination</span>
                        <span className="font-600">{pkg.location}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary">Duration</span>
                        <span>{pkg.durationDays} Days</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-top">
                        <span className="text-secondary">Price per traveler</span>
                        <span className="font-700">${pkg.price}</span>
                    </div>
                </Card>

                <Card title="Confirm Booking">
                    <form onSubmit={handleBooking} className="flex-column gap-2">
                        <Input
                            label="Number of Travelers"
                            type="number"
                            min="1"
                            max={pkg.availableSlots}
                            value={travelerCount}
                            onChange={(e) => setTravelerCount(parseInt(e.target.value))}
                            icon={Users}
                            required
                        />

                        <div className="flex justify-between items-center mt-1 pt-1 border-top">
                            <span className="stat-label">Total Amount</span>
                            <span className="price-value">${pkg.price * travelerCount}</span>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="mt-2 w-full"
                            loading={bookingLoading}
                            icon={CreditCard}
                        >
                            Confirm & Book
                        </Button>
                        <p className="text-center text-small text-muted">No immediate payment required for confirmation.</p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Booking;

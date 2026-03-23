import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowLeft, CalendarCheck, User as UserIcon } from 'lucide-react';
import PackageService from '../services/PackageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getPackageImage, getPackageImages } from '../utils/imageHelper';
import ImageCarousel from '../components/ui/ImageCarousel';

const PackageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPkg = async () => {
            try {
                const response = await PackageService.getById(id);
                setPkg(response.data);
            } catch (error) {
                console.error('Failed to fetch package details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPkg();
    }, [id]);

    if (loading) return <div className="text-center mt-3">Loading trip details...</div>;
    if (!pkg) return <div className="text-center mt-3">Package not found.</div>;

    return (
        <div className="package-details-page">
            <Button
                variant="secondary"
                size="sm"
                icon={ArrowLeft}
                onClick={() => navigate(-1)}
                className="mb-2"
            >
                Back to Explorer
            </Button>

            <div className="details-hero glass" style={
                getPackageImage(pkg.title) ? {
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9)), url("${getPackageImage(pkg.title)}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: 'none',
                    color: 'white'
                } : {}
            }>
                <div className="details-badge">FEATURED TRIP</div>
                <h1 className="details-title-large" style={getPackageImage(pkg.title) ? { color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' } : {}}>{pkg.title}</h1>
                <div className="flex gap-2 items-center" style={getPackageImage(pkg.title) ? { color: '#f8fafc', textShadow: '0 1px 2px rgba(0,0,0,0.5)' } : { color: 'var(--text-secondary)' }}>
                    <MapPin size={18} />
                    <span>{pkg.location}</span>
                    <span className="mx-1">•</span>
                    <Clock size={18} />
                    <span>{pkg.durationDays} Days</span>
                </div>
            </div>

            <div className="grid grid-2-1">
                <div className="flex-column gap-3">
                    {getPackageImages(pkg.title).length > 0 && (
                        <section>
                            <h3 className="mb-2">Gallery</h3>
                            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                <ImageCarousel images={getPackageImages(pkg.title)} alt={pkg.title} height="340px" interval={5000} />
                            </div>
                        </section>
                    )}

                    <section>
                        <h3 className="mb-2">Overview</h3>
                        <p className="text-secondary">{pkg.description}</p>
                    </section>

                    <section>
                        <h3 className="mb-2">Itinerary</h3>
                        <div className="itinerary-list">
                            {pkg.itineraries && pkg.itineraries.length > 0 ? (
                                pkg.itineraries.map((day) => (
                                    <div key={day.id} className="itinerary-item">
                                        <div className="day-circle">
                                            {day.dayNumber}
                                        </div>
                                        <div className="itinerary-content">
                                            <h4 className="day-title">{day.title}</h4>
                                            <p className="day-desc">{day.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No itinerary details available yet.</p>
                            )}
                        </div>
                    </section>
                </div>

                <div className="flex-column gap-2">
                    <Card title="Booking Details">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-secondary">Price per person</span>
                            <span className="price-value">${pkg.price}</span>
                        </div>

                        <div className="flex-column gap-1 mb-2">
                            <div className="meta-item">
                                <Users size={18} />
                                <span>{pkg.availableSlots} slots remaining</span>
                            </div>
                            {pkg.guideId && (
                                <div className="meta-item mt-1">
                                    <UserIcon size={18} />
                                    <span>
                                        Guide: {' '}
                                        <button
                                            className="text-primary font-600"
                                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => navigate('/messages', { state: { newChatUser: { id: pkg.guideId, name: pkg.guideName, role: 'GUIDE' } } })}
                                        >
                                            {pkg.guideName}
                                        </button>
                                    </span>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="primary"
                            className="w-full"
                            icon={CalendarCheck}
                            onClick={() => navigate(`/book/${pkg.id}`)}
                            disabled={pkg.availableSlots === 0}
                        >
                            {pkg.availableSlots > 0 ? 'Book Trip Now' : 'Sold Out'}
                        </Button>
                    </Card>

                    <Card title="What's Included">
                        <ul className="text-small text-secondary flex-column gap-1">
                            <li>✓ Professional Tour Guide</li>
                            <li>✓ Luxury Transportation</li>
                            <li>✓ Luxury 4+ Star Accommodation</li>
                            <li>✓ Selected Meals (Breakfast & Dinner)</li>
                            <li>✓ Entrance Fees to Attractions</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;

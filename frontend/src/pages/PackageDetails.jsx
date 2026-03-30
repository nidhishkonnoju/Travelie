import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowLeft, CalendarCheck, User as UserIcon } from 'lucide-react';
import PackageService from '../services/PackageService';
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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    if (!pkg) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="font-headline text-2xl text-[#1a1a1a]">Package not found.</p>
            </div>
        );
    }

    const images = getPackageImages(pkg.title);

    return (
        <>
            {/* Back navigation */}
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#747878] hover:text-[#1a1a1a] transition-colors mb-8 bg-transparent font-body text-sm"
            >
                <ArrowLeft size={16} />
                <span>Back</span>
            </button>

            {/* Hero Section */}
            <div 
                className="relative w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden mb-12 bg-[#eeeeee]"
                style={
                    getPackageImage(pkg.title) ? {
                        backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.3), rgba(26, 26, 26, 0.8)), url("${getPackageImage(pkg.title)}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    } : {}
                }
            >
                <div className="absolute bottom-8 left-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold mb-3 block">Featured Trip</span>
                    <h1 className="font-headline text-4xl md:text-6xl tracking-tighter text-white mb-3">{pkg.title}</h1>
                    <div className="flex items-center gap-4 text-white/80 font-body text-sm">
                        <span className="flex items-center gap-1"><MapPin size={14} />{pkg.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={14} />{pkg.durationDays} Days</span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 flex flex-col gap-12">
                    {/* Gallery */}
                    {images.length > 0 && (
                        <section>
                            <h3 className="font-headline text-2xl tracking-tight mb-4">Gallery</h3>
                            <div className="overflow-hidden border border-[#eeeeee]">
                                <ImageCarousel images={images} alt={pkg.title} height="340px" interval={5000} />
                            </div>
                        </section>
                    )}

                    {/* Overview */}
                    <section>
                        <h3 className="font-headline text-2xl tracking-tight mb-4">Overview</h3>
                        <p className="font-body text-[#747878] font-light leading-relaxed">{pkg.description}</p>
                    </section>

                    {/* Itinerary */}
                    <section>
                        <h3 className="font-headline text-2xl tracking-tight mb-6">Itinerary</h3>
                        {pkg.itineraries && pkg.itineraries.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {pkg.itineraries.map((day) => (
                                    <div key={day.id} className="flex gap-6 items-start">
                                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#1a1a1a] text-white font-body text-sm font-bold">
                                            {day.dayNumber}
                                        </div>
                                        <div className="flex flex-col gap-1 border-b border-[#eeeeee] pb-6 flex-1">
                                            <h4 className="font-body font-semibold text-[#1a1a1a]">{day.title}</h4>
                                            <p className="font-body text-[#747878] font-light text-sm leading-relaxed">{day.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#747878] font-body font-light">No itinerary details available yet.</p>
                        )}
                    </section>
                </div>

                {/* Sidebar — Booking Card */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white border border-[#eeeeee] p-8 sticky top-32">
                        <h3 className="font-headline text-xl tracking-tight mb-6">Booking Details</h3>
                        
                        <div className="flex justify-between items-center pb-4 border-b border-[#eeeeee] mb-4">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Price per person</span>
                            <span className="font-headline text-2xl tracking-tight text-[#1a1a1a]">${pkg.price}</span>
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex items-center gap-2 text-[#747878] text-sm font-body">
                                <Users size={16} />
                                <span>{pkg.availableSlots} slots remaining</span>
                            </div>
                            {pkg.guideId && (
                                <div className="flex items-center gap-2 text-[#747878] text-sm font-body">
                                    <UserIcon size={16} />
                                    <span>Guide: </span>
                                    <button
                                        className="text-[#1a1a1a] underline underline-offset-4 font-medium bg-transparent"
                                        onClick={() => navigate('/messages', { state: { newChatUser: { id: pkg.guideId, name: pkg.guideName, role: 'GUIDE' } } })}
                                    >
                                        {pkg.guideName}
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate(`/book/${pkg.id}`)}
                            disabled={pkg.availableSlots === 0}
                            className="w-full bg-[#1a1a1a] text-white py-3 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
                        >
                            {pkg.availableSlots > 0 ? 'Book Trip Now' : 'Sold Out'}
                        </button>
                    </div>

                    <div className="bg-white border border-[#eeeeee] p-8">
                        <h3 className="font-headline text-xl tracking-tight mb-4">What's Included</h3>
                        <ul className="flex flex-col gap-2 text-sm font-body text-[#747878]">
                            <li>✓ Professional Tour Guide</li>
                            <li>✓ Luxury Transportation</li>
                            <li>✓ Luxury 4+ Star Accommodation</li>
                            <li>✓ Selected Meals (Breakfast & Dinner)</li>
                            <li>✓ Entrance Fees to Attractions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PackageDetails;

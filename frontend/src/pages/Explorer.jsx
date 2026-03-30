import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackages } from '../context/PackageContext';
import { getPackageImage } from '../utils/imageHelper';

const Explorer = () => {
    const { packages, loading, error } = usePackages();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-body text-[#747878]">Curating your experiences...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center px-4">
                    <p className="font-headline text-2xl text-[#1a1a1a] mb-4">Oops!</p>
                    <p className="font-body text-[#747878] mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-[#1a1a1a] text-white px-8 py-3 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Hero Section */}
            <section className="mb-24">
                <div className="text-center mb-16">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-6 block">Exclusive Collection</span>
                    <h1 className="font-headline text-[5rem] md:text-[6rem] leading-[0.9] tracking-tighter mb-6 text-[#1a1a1a]">
                        Our Curated Journeys.
                    </h1>
                    <p className="font-body text-[#747878] text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        A curated selection of luxury journeys designed to inspire the modern explorer. Each package is a seamless blend of culture, comfort, and breathtaking landscapes.
                    </p>
                </div>
            </section>

            {/* Packages Grid Section */}
            <section className="bg-[#f3f3f4] py-24 md:py-32 px-12 -mx-8 mb-24">
                <div className="max-w-7xl mx-auto">
                    {packages.length === 0 ? (
                        <div className="text-center font-headline text-2xl text-[#1a1a1a]">No packages available at the moment.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                            {packages.map((pkg) => (
                                <article key={pkg.id} className="group flex flex-col gap-6 cursor-pointer" onClick={() => navigate(`/packages/${pkg.id}`)}>
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#eeeeee]">
                                        <img 
                                            src={getPackageImage(pkg.title) || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                                            alt={pkg.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        />
                                        <div className="absolute top-4 left-4 bg-[#2f2f2f]/80 backdrop-blur-md px-3 py-1">
                                            <span className="text-[9px] text-[#ffffff] uppercase tracking-widest">{pkg.location || 'Signature Series'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h2 className="font-headline text-4xl font-light tracking-tight text-[#1a1a1a]">{pkg.title}</h2>
                                        <p className="text-[#5d5f5f] body-md leading-relaxed font-light">{pkg.description.substring(0, 100)}...</p>
                                        
                                        <div className="flex flex-col gap-2 pt-4 border-t border-[#747878]/10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] uppercase tracking-widest text-[#747878]">Duration</span>
                                                <span className="text-sm font-medium">{pkg.durationDays} Days</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] uppercase tracking-widest text-[#747878]">Investment</span>
                                                <span className="text-sm font-medium tracking-tight text-[#1a1a1a]">From ${pkg.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter / Editorial CTA */}
            <section className="py-16 mb-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="flex flex-col gap-8">
                        <h3 className="font-headline text-5xl font-light leading-tight">Join our exclusive travel circle for first access to new itineraries.</h3>
                        <div className="flex flex-col gap-4 max-w-md">
                            <div className="border-b border-[#747878]/30 pb-2">
                                <input 
                                    className="bg-transparent border-none w-full text-[10px] tracking-widest uppercase focus:ring-0 focus:outline-none placeholder:text-[#747878]/50" 
                                    placeholder="YOUR EMAIL ADDRESS" 
                                    type="email"
                                />
                            </div>
                            <button className="text-[#1a1a1a] text-[10px] tracking-widest uppercase font-semibold text-left mt-2 flex items-center gap-2 bg-transparent">
                                Subscribe to the Journey
                                <span className="material-symbols-outlined">arrow_right_alt</span>
                            </button>
                        </div>
                    </div>
                    <div className="relative bg-[#e8e8e8] aspect-video md:aspect-square">
                        <img 
                            className="w-full h-full object-cover" 
                            alt="Luxury travel resort" 
                            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        />
                        <div className="absolute -bottom-8 -left-8 bg-[#1a1a1a] p-12 hidden md:block">
                            <span className="font-headline text-[#ffffff] text-4xl italic font-light">The Experience is Everything.</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Explorer;

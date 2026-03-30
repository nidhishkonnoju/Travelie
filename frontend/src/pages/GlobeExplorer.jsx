import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveGlobe from '../components/InteractiveGlobe';
import { usePackages } from '../context/PackageContext';

const GlobeExplorer = () => {
    const { packages } = usePackages();
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState(null);

    return (
        <>
            {/* Hero Headers */}
            <div className="text-center mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">The Globe</span>
                <h1 className="font-headline text-5xl md:text-6xl tracking-tighter text-[#1a1a1a]">
                    Our World, Your Canvas.
                </h1>
            </div>

            {/* Interactive Globe */}
            <div className="w-full flex justify-center mb-12 relative cursor-grab active:cursor-grabbing max-w-[1000px] mx-auto">
                <InteractiveGlobe 
                    packages={packages} 
                    onLocationClick={(pkg) => setSelectedPackage(pkg)}
                />
            </div>

            {/* Location Selection Bar */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-[1000px] mx-auto">
                {packages.map((pkg) => (
                    <button 
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
                            selectedPackage?.id === pkg.id 
                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' 
                            : 'border-[#e0e0e0] text-[#747878] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                        }`}
                    >
                        {pkg.location || pkg.title.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* Package Details (Fades in when a location is clicked) */}
            <div 
                className={`w-full max-w-2xl mx-auto text-center transition-all duration-700 transform ${
                    selectedPackage 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            >
                {selectedPackage && (
                    <div className="bg-white p-8 border border-[#eeeeee]">
                        <h3 className="font-headline text-3xl tracking-tight text-[#1a1a1a] mb-2">
                            {selectedPackage.title}
                        </h3>
                        <p className="font-body text-[#747878] mb-6">
                            {selectedPackage.durationDays} Days • From ${selectedPackage.price}
                        </p>
                        <p className="font-body text-[#1a1a1a] font-light leading-relaxed mb-8">
                            {selectedPackage.description}
                        </p>
                        <button
                            onClick={() => navigate(`/packages/${selectedPackage.id}`)}
                            className="bg-[#1a1a1a] text-white px-8 py-3 font-body text-sm uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity"
                        >
                            Explore Detail
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default GlobeExplorer;

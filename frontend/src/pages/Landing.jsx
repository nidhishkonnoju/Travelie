import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="font-body bg-[#f9f9f9] text-[#1a1a1a] min-h-screen">
            {/* The Tailwind CDN and fonts are loaded in index.html */}
            {/* HTML BEGIN */}

            <TopNavBar />
            <main className="pt-32">
{/*  Hero Section  */}
<section className="max-w-[1440px] mx-auto px-8 mb-24">
<div className="text-center mb-16">
<h1 className="font-headline text-[6rem] leading-[0.9] tracking-tighter mb-6">Discover luxury.</h1>
<p className="font-body text-[#747878] text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    Curated travel experiences for the modern explorer. Built for those who seek the extraordinary and unforgettable.
                </p>
</div>
<div className="flex gap-4 overflow-hidden h-[600px]">
<div className="flex-1 min-w-[300px] rounded-xl overflow-hidden group">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" data-alt="abstract 3d composition with flowing white architectural ribbons and soft shadows in a minimalist studio setting" src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
</div>
<div className="flex-1 min-w-[300px] rounded-xl overflow-hidden group">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" data-alt="minimalist modern interior design with clean lines, white walls, and a single sculptural chair under soft natural lighting" src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
</div>
<div className="flex-1 min-w-[300px] rounded-xl overflow-hidden group">
<img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" data-alt="dark moody architectural detail of a brutalist concrete staircase with sharp shadows and geometric precision" src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
</div>
</div>
</section>
{/*  Social Proof  */}
<section className="bg-surface-container-low py-20 mb-32">
<div className="max-w-[1440px] mx-auto px-8">
<p className="font-label text-xs tracking-[0.2em] text-[#747878] mb-12 text-center uppercase">Featured in premium travel publications</p>
<div className="flex justify-between items-center opacity-40 px-12">
<span className="font-headline italic text-2xl">CONDÉ NAST</span>
<span className="font-headline font-bold text-2xl">TRAVEL+LEISURE</span>
<span className="font-headline italic text-2xl">NAT GEO</span>
<span className="font-headline font-bold text-2xl">VOGUE</span>
<span className="font-headline italic text-2xl">FORBES</span>
</div>
</div>
</section>
{/*  Testimonial 01  */}
<section className="max-w-[1440px] mx-auto px-8 mb-40 text-center">
<blockquote className="font-headline text-5xl italic leading-tight max-w-4xl mx-auto mb-8">
                "Finally, an agency that understands true luxury. Travelie has completely recalibrated how we experience the world."
            </blockquote>
<cite className="font-body text-sm tracking-widest uppercase text-[#747878] not-italic">— Elena Rostova, Globetrotter</cite>
</section>
{/*  Feature 01  */}
<section className="max-w-[1440px] mx-auto px-8 mb-40 flex flex-col md:flex-row items-center gap-24">
<div className="flex-1">
<span className="font-label text-xs text-[#747878] uppercase tracking-[0.2em] mb-6 block">01 / Curation</span>
<h2 className="font-headline text-6xl tracking-tighter mb-8">Bespoke Itineraries.</h2>
<p className="font-body text-[#747878] text-lg font-light leading-relaxed max-w-md">
                    Seamlessly tailored luxury itineraries. We partner with the world's most exclusive properties to ensure your experience matches your highest expectations.
                </p>
</div>
<div className="flex-[1.5] rounded-xl overflow-hidden h-[600px]">
<img className="w-full h-full object-cover" data-alt="wide shot of a foggy mountain landscape with dramatic peaks and soft blue morning light in a cinematic style" src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
</div>
</section>
{/*  Feature 02  */}
<section className="max-w-[1440px] mx-auto px-8 mb-40 flex flex-col md:flex-row-reverse items-center gap-24">
<div className="flex-1">
<span className="font-label text-xs text-[#747878] uppercase tracking-[0.2em] mb-6 block">02 / Exploration</span>
<h2 className="font-headline text-6xl tracking-tighter mb-8">Global Destinations.</h2>
<p className="font-body text-[#747878] text-lg font-light leading-relaxed max-w-md">
                    An infinite world designed for your exploration. From hidden beach corners to vibrant city centers, discover destinations that feel as magical as a dream.
                </p>
</div>
<div className="flex-[1.5] rounded-xl overflow-hidden h-[600px]">
<img className="w-full h-full object-cover" data-alt="low angle perspective of modern glass skyscrapers in a bustling city with bright afternoon sun reflecting off the surfaces" src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
</div>
</section>
{/*  Feature 03  */}
<section className="max-w-[1440px] mx-auto px-8 mb-40 flex flex-col md:flex-row items-center gap-24">
<div className="flex-1">
<span className="font-label text-xs text-[#747878] uppercase tracking-[0.2em] mb-6 block">03 / Experience</span>
<h2 className="font-headline text-6xl tracking-tighter mb-8">Exclusive Access.</h2>
<p className="font-body text-[#747878] text-lg font-light leading-relaxed max-w-md">
                    Experience the extraordinary. Gain access to private events, exclusive luxury lodgings, and VIP tours that money alone cannot buy.
                </p>
</div>
<div className="flex-[1.5] rounded-xl overflow-hidden h-[600px]">
<img className="w-full h-full object-cover" data-alt="sleek modern office interior with large windows, minimalist furniture, and a sophisticated monochromatic color palette" src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
</div>
</section>
{/*  Feature 04  */}
<section className="max-w-[1440px] mx-auto px-8 mb-40 flex flex-col md:flex-row-reverse items-center gap-24">
<div className="flex-1">
<span className="font-label text-xs text-[#747878] uppercase tracking-[0.2em] mb-6 block">04 / Service</span>
<h2 className="font-headline text-6xl tracking-tighter mb-8">24/7 Concierge.</h2>
<p className="font-body text-[#747878] text-lg font-light leading-relaxed max-w-md">
                    Travel with complete peace of mind. Our dedicated concierge team provides an immersive, high-end support experience across any timezone.
                </p>
</div>
<div className="flex-[1.5] rounded-xl overflow-hidden h-[600px]">
<img className="w-full h-full object-cover" data-alt="close-up of a high-end laptop on a clean wooden desk showing a 3D architectural render with soft depth of field" src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"/>
</div>
</section>
{/*  Secondary Cards  */}
<section className="max-w-[1440px] mx-auto px-8 mb-40 grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="bg-surface-container-low p-16 rounded-xl flex flex-col justify-end min-h-[450px]">
<h3 className="font-headline text-4xl mb-4">Sustainable Travel.</h3>
<p className="font-body text-[#747878] font-light">The earth is ours to protect. We partner with eco-friendly resorts and prioritize sustainable practices across all our exclusive tours.</p>
</div>
<div className="bg-surface-container-low p-16 rounded-xl flex flex-col justify-end min-h-[450px]">
<h3 className="font-headline text-4xl mb-4">Seamless Booking.</h3>
<p className="font-body text-[#747878] font-light">Sophisticated travel shouldn't be complicated. Our booking process is stripped of noise, focusing only on realizing your dream vacation.</p>
</div>
</section>
{/*  Large Testimonial  */}
<section className="bg-[#1a1a1a] text-[#f9f9f9] py-32 mb-40">
<div className="max-w-[1440px] mx-auto px-8 flex flex-col items-center text-center">
<blockquote className="font-headline text-6xl font-light leading-tight mb-12 max-w-5xl">
                    "It feels less like a booking platform and more like a personal concierge. The tactile attention to detail in their service is something I've never seen in an agency before."
                </blockquote>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full overflow-hidden bg-gray-500">
<img className="w-full h-full object-cover" data-alt="portrait of a male architect with a thoughtful expression in black and white" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"/>
</div>
<div className="text-left">
<p className="font-body font-medium">Marcus Chen</p>
<p className="font-body text-xs text-gray-400 uppercase tracking-widest">Frequent Traveler</p>
</div>
</div>
</div>
</section>
{/*  Publication Quotes  */}
<section className="max-w-[1440px] mx-auto px-8 mb-40">
<div className="flex flex-col md:flex-row justify-between items-start gap-12 border-t border-[#eeeeee] pt-16">
<div className="max-w-xs">
<p className="font-headline text-xl mb-4">"The future of luxury travel starts here."</p>
<span className="font-label text-xs uppercase tracking-[0.2em] text-[#747878]">CONDE NAST</span>
</div>
<div className="max-w-xs">
<p className="font-headline text-xl mb-4">"A masterclass in travel curation and bespoke service."</p>
<span className="font-label text-xs uppercase tracking-[0.2em] text-[#747878]">TRAVEL EXTRA</span>
</div>
<div className="max-w-xs">
<p className="font-headline text-xl mb-4">"The bridge between an unforgettable dream and a lived reality."</p>
<span className="font-label text-xs uppercase tracking-[0.2em] text-[#747878]">LUXURY WEEKLY</span>
</div>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="w-full pt-24 pb-12 bg-[#f3f3f4]">
<div className="flex flex-col items-center w-full px-8 max-w-[1440px] mx-auto text-center">
<span className="font-headline italic text-4xl mb-8 block text-[#1a1a1a]">TRAVELIE</span>
<div className="flex flex-wrap justify-center gap-8 mb-16">
<a className="font-body font-light text-xs tracking-[0.05em] uppercase text-[#747878] hover:underline underline-offset-4 transition-all" href="#">Instagram</a>
<a className="font-body font-light text-xs tracking-[0.05em] uppercase text-[#747878] hover:underline underline-offset-4 transition-all" href="#">LinkedIn</a>
<a className="font-body font-light text-xs tracking-[0.05em] uppercase text-[#747878] hover:underline underline-offset-4 transition-all" href="#">Journal</a>
<a className="font-body font-light text-xs tracking-[0.05em] uppercase text-[#747878] hover:underline underline-offset-4 transition-all" href="#">Contact</a>
<a className="font-body font-light text-xs tracking-[0.05em] uppercase text-[#747878] hover:underline underline-offset-4 transition-all" href="#">Terms</a>
<a className="font-body font-light text-xs tracking-[0.05em] uppercase text-[#747878] hover:underline underline-offset-4 transition-all" href="#">Privacy</a>
</div>
<div className="font-body font-light text-xs tracking-[0.05em] uppercase text-[#747878] border-t border-[#eeeeee] pt-12 w-full">
                © 2024 TRAVELIE SPATIAL DESIGN. ALL RIGHTS RESERVED.
            </div>
</div>
</footer>

            {/* HTML END */}
        </div>
    );
};

export default Landing;

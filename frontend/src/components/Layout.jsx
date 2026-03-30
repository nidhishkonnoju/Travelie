import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';

const Layout = () => {
    return (
        <div className="font-body bg-[#f9f9f9] text-[#1a1a1a] min-h-screen flex flex-col">
            <TopNavBar />
            <main className="pt-28 flex-1 max-w-[1440px] w-full mx-auto px-8 pb-12">
                <Outlet />
            </main>

            {/* Shared Editorial Footer */}
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
                        © 2026 TRAVELIE LUXURY EXPERIENCES. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

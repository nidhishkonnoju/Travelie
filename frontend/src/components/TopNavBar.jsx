import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Role-based nav items
    const getNavItems = () => {
        if (!user) {
            return [
                { name: 'About', path: '/' },
                { name: 'Packages', path: '/packages' },
                { name: 'Globe', path: '/exclusive-deals' },
            ];
        }

        if (user.role === 'ADMIN') {
            return [
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Packages', path: '/admin/packages' },
                { name: 'Deals', path: '/admin/deals' },
                { name: 'Users', path: '/users' },
                { name: 'Messages', path: '/messages' },
            ];
        }

        if (user.role === 'GUIDE') {
            return [
                { name: 'Packages', path: '/packages' },
                { name: 'Globe', path: '/exclusive-deals' },
                { name: 'Messages', path: '/messages' },
            ];
        }

        // TRAVELER (default)
        return [
            { name: 'Packages', path: '/packages' },
            { name: 'Globe', path: '/exclusive-deals' },
            { name: 'My Bookings', path: '/bookings' },
            { name: 'Messages', path: '/messages' },
        ];
    };

    const navItems = getNavItems();

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/');
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-[#f9f9f9]/70 backdrop-blur-md">
            <nav className="flex justify-between items-center w-full px-8 py-6 max-w-[1440px] mx-auto relative">
                {/* Logo */}
                <div 
                    onClick={() => navigate('/')} 
                    className="font-headline font-bold text-2xl tracking-tighter text-[#1a1a1a] cursor-pointer"
                >
                    TRAVELIE
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-12">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`bg-transparent font-body font-light tracking-wide text-lg transition-all duration-300 ${
                                    isActive 
                                    ? 'text-[#1a1a1a] border-b border-[#1a1a1a] pb-1' 
                                    : 'text-[#747878] hover:text-[#1a1a1a]'
                                }`}
                            >
                                {item.name}
                            </button>
                        );
                    })}
                </div>

                {/* Right Side — Login or User Dropdown */}
                {!user ? (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="bg-[#1a1a1a] text-white px-6 py-2 rounded-lg font-body text-sm font-medium hover:opacity-80 transition-opacity"
                    >
                        Login
                    </button>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 bg-transparent text-[#1a1a1a] font-body text-sm font-medium transition-opacity hover:opacity-70"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden md:inline">{user.name}</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white border border-[#eeeeee] shadow-lg rounded-lg overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-[#eeeeee]">
                                    <p className="font-body text-sm font-semibold text-[#1a1a1a]">{user.name}</p>
                                    <p className="font-body text-xs text-[#747878] uppercase tracking-widest">{user.role}</p>
                                </div>
                                <button 
                                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                    className="w-full text-left px-4 py-3 font-body text-sm text-[#1a1a1a] hover:bg-[#f3f3f4] transition-colors flex items-center gap-3"
                                >
                                    <User size={16} className="text-[#747878]" />
                                    Profile
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 font-body text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-[#eeeeee]"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom Border */}
                <div className="bg-[#eeeeee] h-[1px] w-full absolute bottom-0 left-0"></div>
            </nav>
        </header>
    );
};

export default TopNavBar;

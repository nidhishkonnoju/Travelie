import React, { useState, useEffect } from 'react';
import { Users, Package, Calendar, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPackages: 0,
        totalBookings: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    const statItems = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users },
        { label: 'Active Packages', value: stats.totalPackages, icon: Package },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar },
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-12">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Administration</span>
                <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Dashboard.</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statItems.map((item, idx) => (
                    <div key={idx} className="bg-white border border-[#eeeeee] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <item.icon size={20} className="text-[#747878]" />
                        </div>
                        <p className="font-headline text-3xl tracking-tight text-[#1a1a1a] mb-1">{item.value}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white border border-[#eeeeee] p-8">
                    <h3 className="font-headline text-2xl tracking-tight mb-2">Revenue Growth</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-8">Calculated from confirmed bookings</p>
                    <div className="flex items-center justify-center py-16">
                        <TrendingUp size={48} className="text-[#eeeeee]" />
                        <p className="ml-4 text-[#747878] font-body font-light">Real-time revenue visualization coming soon.</p>
                    </div>
                </div>

                <div className="bg-white border border-[#eeeeee] p-8">
                    <h3 className="font-headline text-2xl tracking-tight mb-6">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: 'Manage Packages', path: '/admin/packages' },
                            { label: 'Manage Deals', path: '/admin/deals' },
                            { label: 'View All Users', path: '/users' },
                        ].map((action) => (
                            <button 
                                key={action.path}
                                onClick={() => navigate(action.path)}
                                className="w-full flex items-center justify-between px-4 py-3 border border-[#eeeeee] text-sm font-body text-[#1a1a1a] hover:bg-[#f3f3f4] transition-colors bg-transparent"
                            >
                                <span>{action.label}</span>
                                <ArrowUpRight size={16} className="text-[#747878]" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;

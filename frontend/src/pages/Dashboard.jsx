import React, { useState, useEffect } from 'react';
import { Users, Package, Calendar, DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
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
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#6366f1' },
        { label: 'Active Packages', value: stats.totalPackages, icon: Package, color: '#ec4899' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: '#8b5cf6' },
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10b981' },
    ];

    if (loading) return <div className="text-center mt-3">Loading Dashboard...</div>;

    return (
        <div className="dashboard-page">
            <div className="stats-grid">
                {statItems.map((item, idx) => (
                    <Card key={idx} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                            <item.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{item.value}</span>
                            <span className="stat-label">{item.label}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-3 grid grid-2-1">
                <Card title="Revenue Growth" subtitle="Calculated from confirmed bookings">
                    <div className="chart-placeholder">
                        <TrendingUp size={48} color="#6366f1" style={{ opacity: 0.2 }} />
                        <p className="text-muted">Real-time revenue visualization coming soon...</p>
                    </div>
                </Card>

                <Card title="Quick Actions">
                    <div className="flex-column gap-2">
                        <button className="btn btn-secondary justify-between" onClick={() => navigate('/admin/packages')}>
                            <span>Manage Packages</span>
                            <ArrowUpRight size={18} />
                        </button>
                        <button className="btn btn-secondary justify-between" onClick={() => navigate('/admin/deals')}>
                            <span>Manage Deals</span>
                            <ArrowUpRight size={18} />
                        </button>
                        <button className="btn btn-secondary justify-between" onClick={() => navigate('/users')}>
                            <span>View All Users</span>
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

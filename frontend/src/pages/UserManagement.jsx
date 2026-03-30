import React, { useState, useEffect } from 'react';
import { Users, Mail, Search, UserX } from 'lucide-react';
import UserService from '../services/UserService';

const ROLE_CONFIG = {
    ADMIN: { label: 'Admin', color: '#1a1a1a' },
    GUIDE: { label: 'Guide', color: '#c4a35a' },
    TRAVELER: { label: 'Traveler', color: '#747878' },
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await UserService.getAll();
            setUsers(res.data.content || res.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm('Deactivate this user?')) return;
        try {
            await UserService.deactivate(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch { alert('Failed to deactivate user.'); }
    };

    const filtered = users.filter(u => {
        const matchesSearch = search === '' ||
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'ALL' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <>
            <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Administration</span>
                <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">User Management.</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                {['ALL', 'ADMIN', 'GUIDE', 'TRAVELER'].map(role => (
                    <button
                        key={role}
                        className={`px-4 py-2 rounded-full border text-xs uppercase tracking-widest font-semibold transition-all ${
                            filterRole === role
                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                            : 'border-[#e0e0e0] text-[#747878] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-transparent'
                        }`}
                        onClick={() => setFilterRole(role)}
                    >
                        {role === 'ALL' ? 'All Users' : role.charAt(0) + role.slice(1).toLowerCase() + 's'}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="border-b border-[#747878]/30 pb-2 mb-8">
                <input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none placeholder:text-[#747878]/50"
                />
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white border border-[#eeeeee] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#eeeeee]">
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">User</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Email</th>
                                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Role</th>
                                <th className="text-right px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-12 text-[#747878] font-body font-light">No users found.</td></tr>
                            )}
                            {filtered.map(user => {
                                const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.TRAVELER;
                                return (
                                    <tr key={user.id} className="border-b border-[#f3f3f4] hover:bg-[#f9f9f9] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-body font-semibold text-sm text-[#1a1a1a]">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-body text-sm text-[#747878] flex items-center gap-1"><Mail size={12} />{user.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: roleCfg.color }}>
                                                {roleCfg.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDeactivate(user.id)}
                                                className="text-xs font-body text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 ml-auto bg-transparent"
                                            >
                                                <UserX size={14} /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default UserManagement;

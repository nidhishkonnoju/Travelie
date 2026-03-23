import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, UserX, Mail, Search } from 'lucide-react';
import UserService from '../services/UserService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ROLE_CONFIG = {
    ADMIN: { label: 'Admin', color: '#6366f1', bg: '#6366f120' },
    GUIDE: { label: 'Guide', color: '#ec4899', bg: '#ec489920' },
    TRAVELER: { label: 'Traveler', color: '#10b981', bg: '#10b98120' },
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
        <div className="admin-page">
            <div className="page-header mb-3">
                <h2>User Management</h2>
                <p className="text-secondary text-small">View and manage all platform users</p>
            </div>

            <div className="flex gap-2 mb-2 flex-wrap">
                {['ALL', 'ADMIN', 'GUIDE', 'TRAVELER'].map(role => (
                    <button
                        key={role}
                        className={`btn ${filterRole === role ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilterRole(role)}
                    >
                        {role === 'ALL' ? 'All Users' : role.charAt(0) + role.slice(1).toLowerCase() + 's'}
                    </button>
                ))}
            </div>

            <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                icon={Search}
                className="mb-3"
            />

            {loading ? <div className="text-center mt-3">Loading users...</div> : (
                <div className="users-table-wrapper glass">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={4} className="text-center text-muted py-2">No users found.</td></tr>
                            )}
                            {filtered.map(user => {
                                const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.TRAVELER;
                                return (
                                    <tr key={user.id} className="user-row">
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="user-avatar-small">
                                                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <span className="font-600">{user.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-secondary text-small">
                                                <Mail size={14} />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="role-badge"
                                                style={{ background: roleCfg.bg, color: roleCfg.color }}
                                            >
                                                {roleCfg.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="danger" icon={UserX}
                                                    onClick={() => handleDeactivate(user.id)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Calendar,
    Tag,
    MessageSquare,
    Users,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN'] },
        { name: 'Packages', path: '/packages', icon: Package },
        { name: 'Manage Packages', path: '/admin/packages', icon: Package, roles: ['ADMIN'] },
        { name: 'Bookings', path: '/bookings', icon: Calendar },
        { name: 'Deals', path: '/deals', icon: Tag },
        { name: 'Manage Deals', path: '/admin/deals', icon: Tag, roles: ['ADMIN'] },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
        { name: 'Users', path: '/users', icon: Users, roles: ['ADMIN'] },
    ];

    const filteredItems = navItems.filter(item =>
        !item.roles || item.roles.includes(user?.role)
    );

    return (
        <aside className="sidebar glass">
            <div className="sidebar-brand">
                <h2 className="logo-text">Travelie</h2>
            </div>

            <nav className="sidebar-nav">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

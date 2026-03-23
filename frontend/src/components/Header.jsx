import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="header glass">
            <div className="header-left">
                <h1 className="page-title">{title}</h1>
            </div>

            <div className="header-center">
                <div className="search-bar">
                    <Search size={18} />
                    <input type="text" placeholder="Search anything..." />
                </div>
            </div>

            <div className="header-right">
                <button className="icon-btn">
                    <Bell size={20} />
                </button>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                    <div className="user-avatar">
                        <User size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

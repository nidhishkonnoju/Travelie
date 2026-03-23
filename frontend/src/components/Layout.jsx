import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const location = useLocation();

    // Custom title based on route
    const getTitle = (path) => {
        const segments = path.split('/').filter(Boolean);
        if (segments.length === 0) return 'Explorer';
        return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Header title={getTitle(location.pathname)} />
                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

import React, { createContext, useContext, useState, useEffect } from 'react';
import PackageService from '../services/PackageService';

const PackageContext = createContext();

export const PackageProvider = ({ children }) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPackages = async () => {
        try {
            setLoading(true);
            const response = await PackageService.getAll(0, 50); // Fetch a larger set for the global cache
            setPackages(response.data.content || []);
            setError(null);
        } catch (err) {
            console.error('Error loading packages:', err);
            setError('Failed to load packages. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Load once when the provider is mounted
    useEffect(() => {
        loadPackages();
    }, []);

    return (
        <PackageContext.Provider value={{ packages, loading, error, refreshPackages: loadPackages }}>
            {children}
        </PackageContext.Provider>
    );
};

export const usePackages = () => {
    const context = useContext(PackageContext);
    if (!context) {
        throw new Error('usePackages must be used within a PackageProvider');
    }
    return context;
};

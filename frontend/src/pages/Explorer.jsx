import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import PackageService from '../services/PackageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getPackageImages } from '../utils/imageHelper';
import ImageCarousel from '../components/ui/ImageCarousel';

const Explorer = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async (location = '') => {
        try {
            setLoading(true);
            const response = await PackageService.getAll(0, 12, location);
            setPackages(response.data.content || []);
        } catch (error) {
            console.error('Failed to fetch packages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPackages(search);
    };

    return (
        <div className="explorer-page">
            <div className="explorer-header flex justify-between items-center mb-3">
                <div>
                    <h2>Available Adventures</h2>
                    <p className="text-secondary">Explore the world with our curated packages.</p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-1 items-center">
                    <Input
                        placeholder="Search destination..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-0"
                        style={{ width: '240px' }}
                    />
                    <Button type="submit" variant="primary" icon={Search}>Search</Button>
                </form>
            </div>

            {loading ? (
                <div className="text-center mt-3">Loading packages...</div>
            ) : (
                <div className="package-grid">
                    {packages.length > 0 ? (
                        packages.map((pkg) => (
                            <Card key={pkg.id} className="package-card">
                                <div className="package-image-placeholder" style={{ padding: 0, overflow: 'hidden' }}>
                                    {getPackageImages(pkg.title).length > 0 ? (
                                        <ImageCarousel images={getPackageImages(pkg.title)} alt={pkg.title} height="220px" hoverOnly />
                                    ) : (
                                        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <MapPin size={48} className="text-muted" style={{ opacity: 0.2 }} />
                                        </div>
                                    )}
                                </div>
                                <div className="package-info">
                                    <h3 className="package-title">{pkg.title}</h3>
                                    <p className="package-desc text-small">{pkg.description.substring(0, 100)}...</p>

                                    <div className="package-meta mt-1 pt-1 border-top">
                                        <div className="meta-item">
                                            <Clock size={16} />
                                            <span>{pkg.durationDays} Days</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={16} />
                                            <span>{pkg.availableSlots} Slots</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="package-footer flex justify-between items-center mt-2">
                                    <div className="package-price">
                                        <span className="price-label">From</span>
                                        <span className="price-value">${pkg.price}</span>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={ArrowRight}
                                        onClick={() => navigate(`/packages/${pkg.id}`)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center mt-3 py-3 glass w-full">
                            <p>No packages found for your search.</p>
                            <Button variant="secondary" onClick={() => fetchPackages('')} className="mt-2">View All</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Explorer;

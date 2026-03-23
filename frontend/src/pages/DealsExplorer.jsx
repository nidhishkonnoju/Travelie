import React, { useState, useEffect } from 'react';
import { Tag, Clock, Package, ArrowRight } from 'lucide-react';
import DealService from '../services/DealService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { getPackageImage } from '../utils/imageHelper';

const DealsExplorer = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        DealService.getAll()
            .then(r => setDeals(r.data.content || []))
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const isActive = (validUntil) => new Date(validUntil) > new Date();
    const timeLeft = (validUntil) => {
        const diff = new Date(validUntil) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Expired';
        if (days === 0) return 'Ends today!';
        return `${days} day${days !== 1 ? 's' : ''} left`;
    };

    if (loading) return <div className="text-center mt-3">Loading deals...</div>;

    return (
        <div className="deals-page">
            <div className="deals-hero mb-3">
                <h2>Exclusive Deals 🎉</h2>
                <p className="text-secondary">Limited-time offers on our most popular destinations</p>
            </div>

            {deals.filter(d => isActive(d.validUntil)).length === 0 ? (
                <div className="empty-state glass p-3 text-center">
                    <Tag size={64} style={{ opacity: 0.2 }} className="mb-2" />
                    <h3>No Active Deals Right Now</h3>
                    <p className="text-secondary mt-1">Check back soon for upcoming offers, or browse our full collection of packages!</p>
                    <Button variant="primary" className="mt-2" onClick={() => navigate('/packages')}>
                        Browse All Packages
                    </Button>
                </div>
            ) : (
                <div className="deals-grid">
                    {deals.filter(d => isActive(d.validUntil)).map(deal => (
                        <div key={deal.id} className="deal-card glass" style={
                            getPackageImage(deal.packageTitle) ? {
                                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.9)), url("${getPackageImage(deal.packageTitle)}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: 'none',
                                color: 'white'
                            } : {}
                        }>
                            <div className="deal-ribbon">
                                <Tag size={16} />
                                {deal.discountPercentage}% OFF
                            </div>
                            <div className="deal-body">
                                <h3 className="mb-1">{deal.title}</h3>
                                <p className="text-secondary text-small mb-2">
                                    On: {deal.packageTitle || `Package #${deal.packageId}`}
                                </p>
                                <div className="flex items-center gap-1 text-warning text-small font-600 mb-2">
                                    <Clock size={14} />
                                    {timeLeft(deal.validUntil)}
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={ArrowRight}
                                    onClick={() => navigate(`/packages/${deal.packageId}`)}
                                    className="w-full"
                                >
                                    View Package
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deals.filter(d => !isActive(d.validUntil)).length > 0 && (
                <div className="mt-3">
                    <h3 className="mb-2 text-muted">Past Deals</h3>
                    <div className="deals-grid muted">
                        {deals.filter(d => !isActive(d.validUntil)).map(deal => (
                            <div key={deal.id} className="deal-card glass expired" style={
                                getPackageImage(deal.packageTitle) ? {
                                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.95)), url("${getPackageImage(deal.packageTitle)}")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: 'none'
                                } : {}
                            }>
                                <div className="deal-ribbon expired">
                                    <Tag size={16} />
                                    {deal.discountPercentage}% OFF
                                </div>
                                <div className="deal-body">
                                    <h3 className="mb-1 text-muted">{deal.title}</h3>
                                    <p className="text-muted text-small">Expired</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealsExplorer;

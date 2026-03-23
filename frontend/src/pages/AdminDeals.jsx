import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, X, Check, Search } from 'lucide-react';
import DealService from '../services/DealService';
import PackageService from '../services/PackageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const EMPTY_FORM = { title: '', discountPercentage: '', packageId: '', validUntil: '' };

const AdminDeals = () => {
    const [deals, setDeals] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDeals();
        PackageService.getAll(0, 100).then(r => setPackages(r.data.content || []));
    }, []);

    const fetchDeals = async () => {
        try {
            const res = await DealService.getAll();
            setDeals(res.data.content || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (deal) => {
        setEditTarget(deal);
        setForm({
            title: deal.title,
            discountPercentage: deal.discountPercentage,
            packageId: deal.packageId || '',
            validUntil: deal.validUntil ? deal.validUntil.split('T')[0] : '',
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                title: form.title,
                discountPercentage: parseFloat(form.discountPercentage),
                packageId: parseInt(form.packageId),
                validUntil: form.validUntil + 'T23:59:59',
            };
            if (editTarget) {
                await DealService.update(editTarget.id, payload);
            } else {
                await DealService.create(payload);
            }
            setShowModal(false);
            fetchDeals();
        } catch (e) {
            alert('Failed to save deal: ' + (e.response?.data?.message || ''));
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this deal?')) return;
        try {
            await DealService.delete(id);
            setDeals(prev => prev.filter(d => d.id !== id));
        } catch { alert('Failed to delete deal.'); }
    };

    const getPackageName = (id) => packages.find(p => p.id === id)?.title || `Package #${id}`;

    const isActive = (validUntil) => new Date(validUntil) > new Date();

    return (
        <div className="admin-page">
            <div className="page-header flex justify-between items-center mb-3">
                <div>
                    <h2>Manage Deals</h2>
                    <p className="text-secondary text-small">Create and manage promotional offers</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={openCreate}>New Deal</Button>
            </div>

            {loading ? <div className="text-center mt-3">Loading deals...</div> : (
                <div className="deals-admin-grid">
                    {deals.length === 0 && (
                        <div className="text-center text-muted py-3 glass p-3 rounded">
                            <Tag size={48} style={{ opacity: 0.2 }} className="mb-2" />
                            <p>No deals yet. Create your first promotional offer!</p>
                        </div>
                    )}
                    {deals.map(deal => (
                        <Card key={deal.id} className="deal-admin-card">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="deal-icon-badge">
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <h3 className="mb-0">{deal.title}</h3>
                                        <span className="text-small text-secondary">{getPackageName(deal.packageId)}</span>
                                    </div>
                                </div>
                                <span className={`deal-status-badge ${isActive(deal.validUntil) ? 'active' : 'expired'}`}>
                                    {isActive(deal.validUntil) ? 'Active' : 'Expired'}
                                </span>
                            </div>

                            <div className="deal-details mb-2">
                                <div className="flex gap-3">
                                    <div className="deal-stat">
                                        <span className="deal-discount">{deal.discountPercentage}%</span>
                                        <span className="text-small text-muted">Discount</span>
                                    </div>
                                    <div className="deal-stat">
                                        <div className="flex items-center gap-1 text-secondary">
                                            <Calendar size={14} />
                                            <span className="text-small">{new Date(deal.validUntil).toLocaleDateString()}</span>
                                        </div>
                                        <span className="text-small text-muted">Valid Until</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" icon={Edit} onClick={() => openEdit(deal)}>Edit</Button>
                                <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(deal.id)}>Delete</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card glass" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-2">
                            <h3>{editTarget ? 'Edit Deal' : 'New Deal'}</h3>
                            <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="flex-column gap-2">
                            <Input label="Deal Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Summer Flash Sale" required />
                            <div>
                                <label className="input-label">Linked Package</label>
                                <select
                                    className="input-field"
                                    value={form.packageId}
                                    onChange={e => setForm({ ...form, packageId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a package...</option>
                                    {packages.map(p => (
                                        <option key={p.id} value={p.id}>{p.title} — {p.location}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-2">
                                <Input label="Discount (%)" type="number" min="1" max="100" step="0.1" value={form.discountPercentage} onChange={e => setForm({ ...form, discountPercentage: e.target.value })} required />
                                <Input label="Valid Until" type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} required />
                            </div>
                            <div className="flex gap-2 justify-end mt-2">
                                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" icon={Check} loading={saving}>{editTarget ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDeals;

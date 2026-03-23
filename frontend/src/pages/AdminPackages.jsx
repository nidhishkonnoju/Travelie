import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Users, Search, X, Check, User as UserIcon } from 'lucide-react';
import PackageService from '../services/PackageService';
import UserService from '../services/UserService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getPackageImage } from '../utils/imageHelper';

const EMPTY_FORM = {
    title: '', location: '', description: '', price: '',
    durationDays: '', durationNights: '', availableSlots: '', rating: '', guideId: '',
};

const AdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPackages();
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const res = await UserService.getAll(0, 100, 'GUIDE');
            setGuides(res.data.content || []);
        } catch (e) { console.error(e); }
    };

    const fetchPackages = async () => {
        try {
            const res = await PackageService.getAll(0, 50, search);
            setPackages(res.data.content || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (pkg) => {
        setEditTarget(pkg);
        setForm({
            title: pkg.title, location: pkg.location, description: pkg.description,
            price: pkg.price, durationDays: pkg.durationDays, durationNights: pkg.durationNights || '',
            availableSlots: pkg.availableSlots || '', rating: pkg.rating || '', guideId: pkg.guideId || '',
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                durationDays: parseInt(form.durationDays),
                durationNights: form.durationNights ? parseInt(form.durationNights) : null,
                availableSlots: form.availableSlots ? parseInt(form.availableSlots) : null,
                rating: form.rating ? parseFloat(form.rating) : null,
                guideId: form.guideId ? parseInt(form.guideId) : null,
                available: true,
            };
            if (editTarget) {
                await PackageService.update(editTarget.id, payload);
            } else {
                await PackageService.create(payload);
            }
            setShowModal(false);
            fetchPackages();
        } catch (e) {
            alert('Failed to save package. ' + (e.response?.data?.message || ''));
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this package?')) return;
        try {
            await PackageService.delete(id);
            setPackages(prev => prev.filter(p => p.id !== id));
        } catch { alert('Failed to delete package.'); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPackages();
    };

    return (
        <div className="admin-page">
            <div className="page-header flex justify-between items-center mb-3">
                <div>
                    <h2>Manage Packages</h2>
                    <p className="text-secondary text-small">Add, edit, and manage travel destinations</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={openCreate}>New Package</Button>
            </div>

            <form className="flex gap-2 mb-3" onSubmit={handleSearch}>
                <Input
                    placeholder="Search by location or title..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    icon={Search}
                    className="mb-0 flex-1"
                />
                <Button type="submit" variant="secondary">Search</Button>
            </form>

            {loading ? <div className="text-center mt-3">Loading packages...</div> : (
                <div className="packages-admin-grid">
                    {packages.map(pkg => (
                        <Card key={pkg.id} className="package-admin-card">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="mb-1">{pkg.title}</h3>
                                    <div className="flex items-center gap-1 text-secondary text-small">
                                        <MapPin size={14} />
                                        <span>{pkg.location}</span>
                                        <span className="mx-1">·</span>
                                        <Clock size={14} />
                                        <span>{pkg.durationDays} Days</span>
                                        <span className="mx-1">·</span>
                                        <Users size={14} />
                                        <span>{pkg.availableSlots ?? '—'} Slots</span>
                                        {pkg.guideName && (
                                            <>
                                                <span className="mx-1">·</span>
                                                <UserIcon size={14} />
                                                <span>{pkg.guideName}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {getPackageImage(pkg.title) && (
                                    <div className="flex-column items-end gap-1">
                                        <span className="price-badge">${pkg.price}</span>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, marginTop: '4px' }}>
                                            <img src={getPackageImage(pkg.title)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                )}
                                {!getPackageImage(pkg.title) && (
                                    <span className="price-badge">${pkg.price}</span>
                                )}
                            </div>
                            <p className="text-secondary text-small mb-2 text-truncate-2">{pkg.description}</p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" icon={Edit} onClick={() => openEdit(pkg)}>Edit</Button>
                                <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(pkg.id)}>Delete</Button>
                            </div>
                        </Card>
                    ))}
                    {packages.length === 0 && (
                        <div className="text-center text-muted py-3">No packages found. Create one!</div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card glass" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-2">
                            <h3>{editTarget ? 'Edit Package' : 'New Package'}</h3>
                            <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="flex-column gap-2">
                            <div className="grid grid-2">
                                <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                                <Input label="Location" value={form.location} icon={MapPin} onChange={e => setForm({ ...form, location: e.target.value })} required />
                            </div>
                            <div>
                                <label className="input-label">Description</label>
                                <textarea
                                    className="input-field"
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div className="grid grid-2">
                                <Input label="Price ($)" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                                <Input label="Available Slots" type="number" min="0" value={form.availableSlots} onChange={e => setForm({ ...form, availableSlots: e.target.value })} />
                            </div>
                            <div className="grid grid-2">
                                <Input label="Duration (Days)" type="number" min="1" value={form.durationDays} onChange={e => setForm({ ...form, durationDays: e.target.value })} required />
                                <Input label="Duration (Nights)" type="number" min="0" value={form.durationNights} onChange={e => setForm({ ...form, durationNights: e.target.value })} />
                            </div>
                            <div className="grid grid-2">
                                <Input label="Rating (0–5)" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
                                <div>
                                    <label className="input-label">Assign Guide</label>
                                    <select className="input-field" value={form.guideId} onChange={e => setForm({ ...form, guideId: e.target.value })}>
                                        <option value="">-- No Guide --</option>
                                        {guides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                </div>
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

export default AdminPackages;

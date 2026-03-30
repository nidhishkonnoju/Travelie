import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock, Users, Search, X, Check, User as UserIcon } from 'lucide-react';
import PackageService from '../services/PackageService';
import UserService from '../services/UserService';
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
        <>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Administration</span>
                    <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Manage Packages.</h1>
                </div>
                <button onClick={openCreate} className="bg-[#1a1a1a] text-white px-6 py-2 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity flex items-center gap-2">
                    <Plus size={16} /> New Package
                </button>
            </div>

            <form className="flex gap-3 mb-8" onSubmit={handleSearch}>
                <div className="flex-1 border-b border-[#747878]/30 pb-2">
                    <input
                        placeholder="Search by location or title..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none placeholder:text-[#747878]/50"
                    />
                </div>
                <button type="submit" className="border border-[#1a1a1a] text-[#1a1a1a] px-6 py-1 font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#1a1a1a] hover:text-white transition-all bg-transparent">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-white border border-[#eeeeee] p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-start flex-1">
                                    {getPackageImage(pkg.title) && (
                                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-[#f3f3f4]">
                                            <img src={getPackageImage(pkg.title)} alt="thumb" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-body font-semibold text-[#1a1a1a] mb-1">{pkg.title}</h3>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#747878] font-body mb-2">
                                            <span className="flex items-center gap-1"><MapPin size={12} />{pkg.location}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} />{pkg.durationDays} Days</span>
                                            <span className="flex items-center gap-1"><Users size={12} />{pkg.availableSlots ?? '—'} Slots</span>
                                            {pkg.guideName && (
                                                <span className="flex items-center gap-1"><UserIcon size={12} />{pkg.guideName}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#747878] font-body font-light line-clamp-1">{pkg.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                    <span className="font-headline text-xl tracking-tight">${pkg.price}</span>
                                    <button onClick={() => openEdit(pkg)} className="p-2 hover:bg-[#f3f3f4] transition-colors bg-transparent"><Edit size={16} className="text-[#747878]" /></button>
                                    <button onClick={() => handleDelete(pkg.id)} className="p-2 hover:bg-red-50 transition-colors bg-transparent"><Trash2 size={16} className="text-red-400" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {packages.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-[#747878] font-body font-light">No packages found. Create one!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white border border-[#eeeeee] w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-[#eeeeee]">
                            <h3 className="font-headline text-2xl tracking-tight">{editTarget ? 'Edit Package' : 'New Package'}</h3>
                            <button className="bg-transparent hover:opacity-60 transition-opacity" onClick={() => setShowModal(false)}><X size={20} className="text-[#747878]" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Title</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Location</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Description</label>
                                <textarea
                                    className="w-full bg-transparent border border-[#eeeeee] p-3 text-sm font-body text-[#1a1a1a] focus:outline-none resize-vertical"
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Price ($)</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body focus:outline-none" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Available Slots</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body focus:outline-none" type="number" min="0" value={form.availableSlots} onChange={e => setForm({ ...form, availableSlots: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Duration (Days)</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body focus:outline-none" type="number" min="1" value={form.durationDays} onChange={e => setForm({ ...form, durationDays: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Duration (Nights)</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body focus:outline-none" type="number" min="0" value={form.durationNights} onChange={e => setForm({ ...form, durationNights: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Rating (0–5)</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body focus:outline-none" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Assign Guide</label>
                                    <select className="w-full bg-transparent border-b border-[#747878]/30 pb-2 text-sm font-body focus:outline-none" value={form.guideId} onChange={e => setForm({ ...form, guideId: e.target.value })}>
                                        <option value="">-- No Guide --</option>
                                        {guides.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-[#eeeeee]">
                                <button type="button" onClick={() => setShowModal(false)} className="border border-[#eeeeee] text-[#747878] px-6 py-2 font-body text-xs uppercase tracking-widest hover:bg-[#f3f3f4] transition-colors bg-transparent">Cancel</button>
                                <button type="submit" disabled={saving} className="bg-[#1a1a1a] text-white px-6 py-2 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity disabled:opacity-50">
                                    {saving ? 'Saving...' : (editTarget ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminPackages;

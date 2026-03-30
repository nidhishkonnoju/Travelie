import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, X, Check } from 'lucide-react';
import DealService from '../services/DealService';
import PackageService from '../services/PackageService';

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
        <>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Administration</span>
                    <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Manage Deals.</h1>
                </div>
                <button onClick={openCreate} className="bg-[#1a1a1a] text-white px-6 py-2 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity flex items-center gap-2">
                    <Plus size={16} /> New Deal
                </button>
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {deals.length === 0 && (
                        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                            <Tag size={48} className="text-[#eeeeee] mb-4" />
                            <h3 className="font-headline text-2xl text-[#1a1a1a] mb-2">No deals yet</h3>
                            <p className="text-[#747878] font-body font-light">Create your first promotional offer!</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map(deal => (
                            <div key={deal.id} className="bg-white border border-[#eeeeee] p-6 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-body font-semibold text-[#1a1a1a] mb-1">{deal.title}</h3>
                                        <p className="text-xs text-[#747878] font-body">{getPackageName(deal.packageId)}</p>
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-1 ${
                                        isActive(deal.validUntil) 
                                        ? 'text-[#1a1a1a] bg-[#f3f3f4]' 
                                        : 'text-[#747878] bg-[#f9f9f9]'
                                    }`}>
                                        {isActive(deal.validUntil) ? 'Active' : 'Expired'}
                                    </span>
                                </div>

                                <div className="flex gap-6 mb-6">
                                    <div>
                                        <span className="font-headline text-3xl tracking-tight text-[#1a1a1a]">{deal.discountPercentage}%</span>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mt-1">Discount</p>
                                    </div>
                                    <div>
                                        <span className="font-body text-sm text-[#1a1a1a] flex items-center gap-1"><Calendar size={14} />{new Date(deal.validUntil).toLocaleDateString()}</span>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mt-1">Valid Until</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto pt-4 border-t border-[#eeeeee]">
                                    <button onClick={() => openEdit(deal)} className="flex items-center gap-1 text-xs font-body text-[#747878] hover:text-[#1a1a1a] transition-colors bg-transparent"><Edit size={14} /> Edit</button>
                                    <button onClick={() => handleDelete(deal.id)} className="flex items-center gap-1 text-xs font-body text-red-400 hover:text-red-600 transition-colors bg-transparent"><Trash2 size={14} /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white border border-[#eeeeee] w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-[#eeeeee]">
                            <h3 className="font-headline text-2xl tracking-tight">{editTarget ? 'Edit Deal' : 'New Deal'}</h3>
                            <button className="bg-transparent hover:opacity-60 transition-opacity" onClick={() => setShowModal(false)}><X size={20} className="text-[#747878]" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Deal Title</label>
                                <div className="border-b border-[#747878]/30 pb-2">
                                    <input className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Summer Flash Sale" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Linked Package</label>
                                <select className="w-full bg-transparent border-b border-[#747878]/30 pb-2 text-sm font-body focus:outline-none" value={form.packageId} onChange={e => setForm({ ...form, packageId: e.target.value })} required>
                                    <option value="">Select a package...</option>
                                    {packages.map(p => (<option key={p.id} value={p.id}>{p.title} — {p.location}</option>))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Discount (%)</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body focus:outline-none" type="number" min="1" max="100" step="0.1" value={form.discountPercentage} onChange={e => setForm({ ...form, discountPercentage: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Valid Until</label>
                                    <div className="border-b border-[#747878]/30 pb-2">
                                        <input className="bg-transparent w-full text-sm font-body focus:outline-none" type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} required />
                                    </div>
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

export default AdminDeals;

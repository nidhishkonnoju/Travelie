import React from 'react';
import { User, Mail, Shield, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <div className="mb-12">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Account</span>
                <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Profile.</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-2 bg-white border border-[#eeeeee] p-8">
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#eeeeee]">
                        <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white font-headline text-3xl">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="font-headline text-3xl tracking-tight text-[#1a1a1a]">{user.name}</h2>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mt-1">{user.role}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <Mail size={18} className="text-[#747878]" />
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-1">Email Address</p>
                                <p className="font-body text-[#1a1a1a]">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Shield size={18} className="text-[#747878]" />
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-1">Account Permissions</p>
                                <p className="font-body text-[#1a1a1a]">{user.role === 'ADMIN' ? 'Full System Access' : 'Standard User Access'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ShieldCheck size={18} className="text-[#747878]" />
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-1">Security Status</p>
                                <p className="font-body text-[#1a1a1a]">Verified Account</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#eeeeee] flex gap-4">
                        <button className="border border-[#1a1a1a] text-[#1a1a1a] px-6 py-2 font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#1a1a1a] hover:text-white transition-all bg-transparent">
                            Edit Profile
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="border border-red-300 text-red-600 px-6 py-2 font-body text-xs uppercase tracking-widest font-semibold hover:bg-red-50 transition-all flex items-center gap-2 bg-transparent"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white border border-[#eeeeee] p-8 h-fit">
                    <h3 className="font-headline text-xl tracking-tight mb-4">Security Settings</h3>
                    <p className="font-body text-sm text-[#747878] font-light mb-6">Manage your password and authentication settings.</p>
                    <button className="w-full border border-[#1a1a1a] text-[#1a1a1a] py-2 font-body text-xs uppercase tracking-widest font-semibold hover:bg-[#1a1a1a] hover:text-white transition-all bg-transparent">
                        Update Password
                    </button>
                </div>
            </div>
        </>
    );
};

export default Profile;

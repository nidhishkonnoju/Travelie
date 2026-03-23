import React from 'react';
import { User, Mail, Shield, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="grid grid-2-1">
                <Card className="profile-details-card">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="user-avatar-large">
                            <User size={48} />
                        </div>
                        <div>
                            <h2 className="user-profile-name">{user.name}</h2>
                            <p className="text-secondary">{user.role}</p>
                        </div>
                    </div>

                    <div className="flex-column gap-2 mt-3">
                        <div className="info-item">
                            <Mail size={18} className="text-muted" />
                            <div className="info-content">
                                <span className="info-label">Email Address</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <Shield size={18} className="text-muted" />
                            <div className="info-content">
                                <span className="info-label">Account Permissions</span>
                                <span className="info-value">{user.role === 'ADMIN' ? 'Full System Access' : 'Standard User Access'}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <ShieldCheck size={18} className="text-muted" />
                            <div className="info-content">
                                <span className="info-label">Security Status</span>
                                <span className="info-value text-success">Verified Account</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <Button variant="secondary">Edit Profile</Button>
                        <Button variant="danger" icon={LogOut} onClick={logout}>Sign Out</Button>
                    </div>
                </Card>

                <Card title="Security Settings">
                    <p className="text-small mb-2">Manage your password and authentication settings.</p>
                    <Button variant="secondary" className="w-full">Update Password</Button>
                </Card>
            </div>
        </div>
    );
};

export default Profile;

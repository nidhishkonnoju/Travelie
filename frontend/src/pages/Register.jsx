import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TopNavBar from '../components/TopNavBar';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'TRAVELER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(formData);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="font-body bg-[#f9f9f9] text-[#1a1a1a] min-h-screen">
            <TopNavBar />
            <div className="pt-32 flex items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-md">
                    {/* Editorial heading */}
                    <div className="text-center mb-10">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Get Started</span>
                        <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Create Account.</h1>
                    </div>

                    <div className="bg-white border border-[#eeeeee] p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Full Name</label>
                                <div className="border-b border-[#747878]/30 pb-2">
                                    <input 
                                        className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none placeholder:text-[#747878]/50" 
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Email Address</label>
                                <div className="border-b border-[#747878]/30 pb-2">
                                    <input 
                                        className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none placeholder:text-[#747878]/50" 
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Password</label>
                                <div className="border-b border-[#747878]/30 pb-2">
                                    <input 
                                        className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none placeholder:text-[#747878]/50" 
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">I am a...</label>
                                <select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange} 
                                    className="w-full bg-transparent border-b border-[#747878]/30 pb-2 text-sm font-body text-[#1a1a1a] focus:outline-none"
                                >
                                    <option value="TRAVELER">Traveler</option>
                                    <option value="GUIDE">Guide</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1a1a1a] text-white py-3 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 mt-2"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <p className="text-center font-body text-sm text-[#747878]">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#1a1a1a] underline underline-offset-4 font-medium">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

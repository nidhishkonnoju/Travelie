import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TopNavBar from '../components/TopNavBar';

const getDefaultRoute = (role) => {
    if (role === 'ADMIN') return '/dashboard';
    if (role === 'GUIDE') return '/messages';
    return '/packages'; // TRAVELER default
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            // Get the user from localStorage since login just set it
            const savedUser = JSON.parse(localStorage.getItem('user'));
            const from = location.state?.from?.pathname || getDefaultRoute(savedUser?.role);
            navigate(from, { replace: true });
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="font-body bg-[#f9f9f9] text-[#1a1a1a] min-h-screen">
            <TopNavBar />
            <div className="pt-32 flex items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-md">
                    {/* Editorial heading */}
                    <div className="text-center mb-10">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#747878] font-semibold mb-4 block">Welcome Back</span>
                        <h1 className="font-headline text-5xl tracking-tighter text-[#1a1a1a]">Sign In.</h1>
                    </div>

                    <div className="bg-white border border-[#eeeeee] p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Email Address</label>
                                <div className="border-b border-[#747878]/30 pb-2">
                                    <input 
                                        className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none placeholder:text-[#747878]/50" 
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-[#747878] font-semibold mb-2 block">Password</label>
                                <div className="border-b border-[#747878]/30 pb-2">
                                    <input 
                                        className="bg-transparent w-full text-sm font-body text-[#1a1a1a] focus:outline-none placeholder:text-[#747878]/50" 
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1a1a1a] text-white py-3 font-body text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 mt-2"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>

                            <p className="text-center font-body text-sm text-[#747878]">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-[#1a1a1a] underline underline-offset-4 font-medium">Create one</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

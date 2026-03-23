import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card" title="Welcome Back" subtitle="Login to manage your travels">
                <form onSubmit={handleSubmit} className="flex-column gap-2">
                    {error && <div className="error-banner">{error}</div>}

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="admin@travelie.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="mt-1"
                        loading={loading}
                        icon={LogIn}
                    >
                        Sign In
                    </Button>

                    <p className="text-center text-small">
                        Don't have an account? <Link to="/register" className="link">Create one</Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Login;

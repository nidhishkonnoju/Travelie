import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

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
        <div className="auth-container">
            <Card className="auth-card" title="Get Started" subtitle="Create an account to join Travelie">
                <form onSubmit={handleSubmit} className="flex-column gap-2">
                    {error && <div className="error-banner">{error}</div>}

                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        icon={User}
                        required
                    />

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        icon={Mail}
                        required
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        icon={Lock}
                        required
                    />

                    <div className="input-group">
                        <label className="input-label">I am a...</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="input-wrapper" style={{ padding: '0.75rem 1rem' }}>
                            <option value="TRAVELER">Traveler</option>
                            <option value="GUIDE">Guide</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="mt-1"
                        loading={loading}
                        icon={UserPlus}
                    >
                        Create Account
                    </Button>

                    <p className="text-center text-small">
                        Already have an account? <Link to="/login" className="link">Sign in</Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Register;

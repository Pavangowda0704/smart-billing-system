import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/register-cart');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            showToast('Please enter both username and password.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const loggedInUser = await login(username);
            showToast(`Welcome, ${loggedInUser.username}!`, 'success');
            // Navigate will be handled by useEffect
        } catch (error) {
            showToast('Login failed. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Smart Cart System
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to start shopping
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input
                        id="username"
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                    <Button type="submit" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>
                 <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-center text-gray-600 dark:text-gray-300">
                    <p className="font-semibold">Login Details:</p>
                    <p>User: <code className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">demo</code></p>
                    <p>Admin: <code className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">admin</code></p>
                    <p>Password: <code className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">password</code> (any password works)</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
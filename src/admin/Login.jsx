import React, { useState } from 'react';
import { Lock } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authAPI.login({ username, password });
            
            if (response.success) {
                localStorage.setItem('adroit_token', response.data.token);
                localStorage.setItem('adroit_user', JSON.stringify(response.data.user));
                onLogin(true);
            }
        } catch (err) {
            setError(err.message || 'Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-lg backdrop-blur-xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-[#C5A059]/20 rounded-full flex items-center justify-center text-[#C5A059]">
                        <Lock size={24} />
                    </div>
                </div>
                <h2 className="text-2xl font-serif text-white text-center mb-2">Admin Access</h2>
                <p className="text-white/40 text-center text-sm mb-8">Enter credentials to dashboard</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setError(false); }}
                            placeholder="Username"
                            className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-[#C5A059] transition-colors rounded mb-4"
                            autoFocus
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-[#C5A059] transition-colors rounded"
                            disabled={isLoading}
                        />
                        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#C5A059] text-black font-bold py-4 uppercase tracking-widest hover:bg-white transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;

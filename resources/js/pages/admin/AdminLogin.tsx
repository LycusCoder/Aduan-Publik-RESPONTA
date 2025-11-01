import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAdminAuth();
    const [formData, setFormData] = useState({
        no_hp: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(
                err.response?.data?.message || 
                'Login gagal. Periksa kembali nomor HP dan password Anda.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo & Title */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <LockClosedIcon className="h-10 w-10 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Admin Panel RESPONTA
                    </h2>
                    <p className="mt-2 text-sm text-blue-100">
                        Masuk untuk mengelola sistem aduan warga
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* No HP */}
                        <div>
                            <label htmlFor="no-hp" className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor HP
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="no-hp"
                                    name="no_hp"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.no_hp}
                                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>

                    {/* Link to public site */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            ← Kembali ke Portal Warga
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-blue-100">
                    © 2025 RESPONTA. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
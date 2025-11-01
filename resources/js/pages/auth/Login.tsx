import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FormattedInput from '../../components/ui/FormattedInput';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { LoginCredentials } from '../../types';

interface FormErrors {
    no_hp?: string[];
    password?: string[];
}

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginCredentials>({
        no_hp: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Auto-focus first input
    useEffect(() => {
        const firstInput = document.getElementById('no_hp');
        if (firstInput) {
            firstInput.focus();
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setAlert(null);

        try {
            await login(formData);
            
            // Show success animation
            setShowSuccess(true);
            setAlert({ type: 'success', message: '🎉 Login berhasil! Mengalihkan ke dashboard...' });
            
            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('remember_phone', formData.no_hp);
            } else {
                localStorage.removeItem('remember_phone');
            }
            
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error: any) {
            console.error('Login error:', error);
            setShowSuccess(false);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setAlert({
                    type: 'error',
                    message: error.response?.data?.message || 'Login gagal. Periksa kembali nomor HP dan password Anda.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Load remembered phone
    useEffect(() => {
        const rememberedPhone = localStorage.getItem('remember_phone');
        if (rememberedPhone) {
            setFormData(prev => ({ ...prev, no_hp: rememberedPhone }));
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Success overlay animation */}
            {showSuccess && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 z-50 flex items-center justify-center animate-fade-in">
                    <div className="text-center text-white">
                        <CheckCircleIcon className="h-20 w-20 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold">Login Berhasil!</h3>
                    </div>
                </div>
            )}

            <div className="p-8 md:p-10">
                {/* Header with modern gradient */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Selamat Datang Kembali
                    </h2>
                    <p className="text-gray-600">Masuk ke akun RESPONTA Anda untuk melaporkan aduan</p>
                </div>

                {/* Alert */}
                {alert && (
                    <div className="mb-6 animate-slide-down">
                        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormattedInput
                        label="Nomor HP"
                        id="no_hp"
                        name="no_hp"
                        formatType="phone"
                        showValidation={true}
                        placeholder="081234567890"
                        value={formData.no_hp}
                        onChange={handleChange}
                        error={errors.no_hp?.[0]}
                        required
                        data-testid="login-phone-input"
                    />

                    <PasswordInput
                        label="Password"
                        id="password"
                        name="password"
                        placeholder="Masukkan password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password?.[0]}
                        required
                        data-testid="login-password-input"
                    />

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                data-testid="remember-me-checkbox"
                            />
                            <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                                Ingat saya
                            </span>
                        </label>
                        <Link 
                            to="/forgot-password" 
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                        >
                            Lupa password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={loading}
                        data-testid="login-submit-button"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Memproses...
                            </div>
                        ) : (
                            <span className="flex items-center justify-center">
                                <span>Masuk</span>
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        )}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Belum punya akun?</span>
                    </div>
                </div>

                {/* Footer - Register link */}
                <div className="text-center">
                    <Link 
                        to="/register" 
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] group"
                        data-testid="register-link"
                    >
                        <span>Daftar Sekarang</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        </div>
    );
};

export default Login;
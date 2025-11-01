import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FormattedInput from '../../components/ui/FormattedInput';
import PasswordInput from '../../components/ui/PasswordInput';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { RegisterData } from '../../types';

interface FormErrors {
    name?: string[];
    no_hp?: string[];
    nik?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
}

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState<RegisterData>({
        name: '',
        no_hp: '',
        nik: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Auto-focus first input
    useEffect(() => {
        const firstInput = document.getElementById('name');
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

    const validateStep1 = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = ['Nama lengkap wajib diisi'];
        if (!formData.no_hp) newErrors.no_hp = ['Nomor HP wajib diisi'];
        if (!formData.nik) newErrors.nik = ['NIK wajib diisi'];
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (currentStep === 1) {
            handleNextStep();
            return;
        }

        setLoading(true);
        setErrors({});
        setAlert(null);

        try {
            const response = await register(formData);
            
            // Show success animation
            setShowSuccess(true);
            setAlert({
                type: 'success',
                message: response.message || '🎉 Registrasi berhasil! Selamat datang di RESPONTA!'
            });
            
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error: any) {
            console.error('Register error:', error);
            setShowSuccess(false);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setAlert({
                    type: 'error',
                    message: error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Success overlay animation */}
            {showSuccess && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 z-50 flex items-center justify-center animate-fade-in">
                    <div className="text-center text-white">
                        <CheckCircleIcon className="h-20 w-20 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold">Registrasi Berhasil!</h3>
                        <p className="mt-2">Selamat bergabung dengan RESPONTA</p>
                    </div>
                </div>
            )}

            <div className="p-8 md:p-10">
                {/* Header with modern gradient */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center transform -rotate-3 hover:rotate-3 transition-transform duration-300">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Daftar Akun Baru
                    </h2>
                    <p className="text-gray-600">Bergabung dengan RESPONTA untuk melaporkan aduan warga</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                            currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
                        }`}>
                            {currentStep > 1 ? (
                                <CheckCircleIcon className="w-6 h-6" />
                            ) : (
                                <span className="font-bold">1</span>
                            )}
                        </div>
                        <div className={`w-16 h-1 rounded transition-all duration-300 ${
                            currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                        }`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                            currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
                        }`}>
                            <span className="font-bold">2</span>
                        </div>
                    </div>
                </div>

                {/* Step labels */}
                <div className="flex justify-center mb-6">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                            {currentStep === 1 ? 'Data Pribadi' : 'Keamanan Akun'}
                        </p>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className="mb-6 animate-slide-down">
                        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Step 1: Personal Data */}
                    {currentStep === 1 && (
                        <div className="space-y-5 animate-slide-right">
                            <Input
                                label="Nama Lengkap"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Masukkan nama lengkap sesuai KTP"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name?.[0]}
                                required
                                data-testid="register-name-input"
                            />

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
                                data-testid="register-phone-input"
                            />

                            <FormattedInput
                                label="NIK (Nomor Induk Kependudukan)"
                                id="nik"
                                name="nik"
                                formatType="nik"
                                showValidation={true}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={formData.nik}
                                onChange={handleChange}
                                error={errors.nik?.[0]}
                                required
                                data-testid="register-nik-input"
                            />

                            <Input
                                label="Email (Opsional)"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email?.[0]}
                                data-testid="register-email-input"
                            />
                        </div>
                    )}

                    {/* Step 2: Password */}
                    {currentStep === 2 && (
                        <div className="space-y-5 animate-slide-left">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Tips keamanan:</strong> Gunakan password yang kuat dengan minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
                                </p>
                            </div>

                            <PasswordInput
                                label="Password"
                                id="password"
                                name="password"
                                placeholder="Min. 8 karakter"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password?.[0]}
                                showStrength={true}
                                required
                                data-testid="register-password-input"
                            />

                            <PasswordInput
                                label="Konfirmasi Password"
                                id="password_confirmation"
                                name="password_confirmation"
                                placeholder="Ulangi password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                error={errors.password_confirmation?.[0]}
                                required
                                data-testid="register-password-confirm-input"
                            />
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-2">
                        {currentStep === 2 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                onClick={() => setCurrentStep(1)}
                                disabled={loading}
                            >
                                ← Kembali
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className={`${
                                currentStep === 1 ? 'w-full' : 'flex-1'
                            } relative overflow-hidden group bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl`}
                            disabled={loading}
                            data-testid="register-submit-button"
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
                                    <span>{currentStep === 1 ? 'Lanjut' : 'Daftar Sekarang'}</span>
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Sudah punya akun?</span>
                    </div>
                </div>

                {/* Footer - Login link */}
                <div className="text-center">
                    <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] group"
                        data-testid="login-link"
                    >
                        <span>Masuk di sini</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        </div>
    );
};

export default Register;
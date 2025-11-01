import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
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
            setAlert({ type: 'success', message: 'Login berhasil! Mengalihkan...' });
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setAlert({
                    type: 'error',
                    message: error.response?.data?.message || 'Login gagal. Silakan coba lagi.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
                <p className="text-gray-600 mt-2">Login ke akun RESPONTA Anda</p>
            </div>

            {/* Alert */}
            {alert && (
                <div className="mb-6">
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Nomor HP"
                    id="no_hp"
                    name="no_hp"
                    type="text"
                    placeholder="081234567890"
                    value={formData.no_hp}
                    onChange={handleChange}
                    error={errors.no_hp?.[0]}
                    required
                />

                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password?.[0]}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Memproses...' : 'Login'}
                </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                        Daftar Sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
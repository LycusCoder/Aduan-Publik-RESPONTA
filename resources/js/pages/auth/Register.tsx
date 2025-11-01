import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
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
            const response = await register(formData);
            setAlert({
                type: 'success',
                message: response.message || 'Registrasi berhasil! Mengalihkan...'
            });
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error: any) {
            console.error('Register error:', error);
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
        <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Daftar Akun Baru</h2>
                <p className="text-gray-600 mt-2">Bergabung dengan RESPONTA</p>
            </div>

            {/* Alert */}
            {alert && (
                <div className="mb-6">
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nama Lengkap"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name?.[0]}
                    required
                />

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
                    label="NIK (Nomor Induk Kependudukan)"
                    id="nik"
                    name="nik"
                    type="text"
                    placeholder="16 digit NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    error={errors.nik?.[0]}
                    required
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
                />

                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password?.[0]}
                    required
                />

                <Input
                    label="Konfirmasi Password"
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation?.[0]}
                    required
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </Button>
                </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Login di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
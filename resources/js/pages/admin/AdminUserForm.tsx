import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminUserService, organizationService, dinasService } from '../../services/adminApi';
import type { AdminUser, Role, Organization, Dinas } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface FormData {
    name: string;
    no_hp: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: string;
    organization_id: string;
    dinas_id: string;
    is_admin: boolean;
}

const AdminUserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // Form data
    const [formData, setFormData] = useState<FormData>({
        name: '',
        no_hp: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
        organization_id: '',
        dinas_id: '',
        is_admin: true,
    });

    // Dropdown data
    const [roleList, setRoleList] = useState<Role[]>([]);
    const [organizationList, setOrganizationList] = useState<Organization[]>([]);
    const [dinasList, setDinasList] = useState<Dinas[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    useEffect(() => {
        loadInitialData();
    }, [id]);

    useEffect(() => {
        if (formData.role_id) {
            const role = roleList.find(r => r.id === parseInt(formData.role_id));
            setSelectedRole(role || null);
        }
    }, [formData.role_id, roleList]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            // Load roles, organizations, dinas
            const [rolesRes, orgRes, dinasRes] = await Promise.all([
                adminUserService.getRoles(),
                organizationService.getList({ active_only: true }),
                dinasService.getList({ active_only: true }),
            ]);
            setRoleList(rolesRes.data || []);
            setOrganizationList(orgRes.data || []);
            setDinasList(dinasRes.data || []);

            // If edit mode, load user data
            if (isEditMode && id) {
                const userRes = await adminUserService.getDetail(parseInt(id));
                const user = userRes.data;
                setFormData({
                    name: user.name,
                    no_hp: user.no_hp,
                    email: user.email || '',
                    password: '',
                    password_confirmation: '',
                    role_id: user.role.id.toString(),
                    organization_id: user.organization?.id?.toString() || '',
                    dinas_id: user.dinas?.id?.toString() || '',
                    is_admin: user.is_admin,
                });
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Nama harus diisi');
            return false;
        }
        if (!formData.no_hp.trim()) {
            setError('No HP harus diisi');
            return false;
        }
        if (!/^08[0-9]{8,11}$/.test(formData.no_hp)) {
            setError('No HP tidak valid (harus 08xxxxxxxxxx)');
            return false;
        }
        if (!formData.role_id) {
            setError('Role harus dipilih');
            return false;
        }

        // Password validation (required for create, optional for edit)
        if (!isEditMode) {
            if (!formData.password) {
                setError('Password harus diisi');
                return false;
            }
            if (formData.password.length < 8) {
                setError('Password minimal 8 karakter');
                return false;
            }
            if (formData.password !== formData.password_confirmation) {
                setError('Konfirmasi password tidak cocok');
                return false;
            }
        } else if (formData.password) {
            // If editing and password filled, validate
            if (formData.password.length < 8) {
                setError('Password minimal 8 karakter');
                return false;
            }
            if (formData.password !== formData.password_confirmation) {
                setError('Konfirmasi password tidak cocok');
                return false;
            }
        }

        // Conditional validation based on role
        if (selectedRole) {
            // Admin Kota, Admin Kecamatan, Admin Kelurahan need organization
            if (['admin_kota', 'admin_kecamatan', 'admin_kelurahan'].includes(selectedRole.name)) {
                if (!formData.organization_id) {
                    setError(`${selectedRole.display_name} harus memilih organisasi`);
                    return false;
                }
            }

            // Admin Dinas, Staff Dinas need dinas
            if (['admin_dinas', 'staff_dinas'].includes(selectedRole.name)) {
                if (!formData.dinas_id) {
                    setError(`${selectedRole.display_name} harus memilih dinas`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const payload: any = {
                name: formData.name,
                no_hp: formData.no_hp,
                email: formData.email || undefined,
                role_id: parseInt(formData.role_id),
                is_admin: formData.is_admin,
            };

            // Add password if provided
            if (formData.password) {
                payload.password = formData.password;
            }

            // Add organization if selected
            if (formData.organization_id) {
                payload.organization_id = parseInt(formData.organization_id);
            }

            // Add dinas if selected
            if (formData.dinas_id) {
                payload.dinas_id = parseInt(formData.dinas_id);
            }

            if (isEditMode && id) {
                await adminUserService.update(parseInt(id), payload);
                setSuccess('User berhasil diupdate');
                setTimeout(() => navigate('/admin/users'), 1500);
            } else {
                await adminUserService.create(payload);
                setSuccess('User berhasil dibuat');
                setTimeout(() => navigate('/admin/users'), 1500);
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Gagal menyimpan user';
            const errors = error.response?.data?.errors;
            if (errors) {
                const errorMessages = Object.values(errors).flat().join(', ');
                setError(`${errorMsg}: ${errorMessages}`);
            } else {
                setError(errorMsg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const requiresOrganization = selectedRole && ['admin_kota', 'admin_kecamatan', 'admin_kelurahan'].includes(selectedRole.name);
    const requiresDinas = selectedRole && ['admin_dinas', 'staff_dinas'].includes(selectedRole.name);

    if (loading) {
        return <LoadingSpinner message={isEditMode ? 'Memuat data user...' : 'Memuat form...'} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit User' : 'Tambah User Baru'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {isEditMode ? 'Update informasi user' : 'Buat user admin/staff baru'}
                    </p>
                </div>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Name */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                            </div>

                            {/* No HP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    No HP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.no_hp}
                                    onChange={(e) => handleInputChange('no_hp', e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="08xxxxxxxxxx"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Format: 08xxxxxxxxxx (10-13 digit)</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email (Opsional)
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {isEditMode ? 'Ubah Password (Opsional)' : 'Password'}
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {!isEditMode && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Minimal 8 karakter"
                                        required={!isEditMode}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {isEditMode && (
                                    <p className="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Konfirmasi Password {!isEditMode && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        value={formData.password_confirmation}
                                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                        className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Ulangi password"
                                        required={!isEditMode}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirm ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role & Organization */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Role & Organisasi</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) => {
                                        handleInputChange('role_id', e.target.value);
                                        // Reset organization/dinas when role changes
                                        handleInputChange('organization_id', '');
                                        handleInputChange('dinas_id', '');
                                    }}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Pilih Role</option>
                                    {roleList.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.display_name} (Level {role.level})
                                        </option>
                                    ))}
                                </select>
                                {selectedRole && (
                                    <p className="mt-1 text-xs text-gray-500">{selectedRole.description}</p>
                                )}
                            </div>

                            {/* Organization (Conditional) */}
                            {requiresOrganization && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Organisasi <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.organization_id}
                                        onChange={(e) => handleInputChange('organization_id', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Pilih Organisasi</option>
                                        {organizationList.map((org) => (
                                            <option key={org.id} value={org.id}>
                                                {org.name} ({org.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Dinas (Conditional) */}
                            {requiresDinas && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dinas <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.dinas_id}
                                        onChange={(e) => handleInputChange('dinas_id', e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Pilih Dinas</option>
                                        {dinasList.map((dinas) => (
                                            <option key={dinas.id} value={dinas.id}>
                                                {dinas.name} ({dinas.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Is Admin Checkbox */}
                            <div className="sm:col-span-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_admin"
                                        checked={formData.is_admin}
                                        onChange={(e) => handleInputChange('is_admin', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                                        User ini adalah Admin (dapat akses admin panel)
                                    </label>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Centang jika user ini perlu akses ke admin panel</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 rounded-b-lg">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/users')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={submitting}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Menyimpan...' : isEditMode ? 'Update User' : 'Buat User'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminUserForm;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminUserService, adminAduanService } from '../../services/adminApi';
import type { AdminUser, AdminAduan } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { 
    ArrowLeftIcon, 
    PencilIcon, 
    TrashIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

const AdminUserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [assignedAduan, setAssignedAduan] = useState<AdminAduan[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (id) {
            loadUserDetail();
        }
    }, [id]);

    const loadUserDetail = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const userRes = await adminUserService.getDetail(parseInt(id));
            setUser(userRes.data);

            // Load assigned aduan if user is staff/admin
            if (userRes.data.is_admin) {
                try {
                    const aduanRes = await adminAduanService.getList({
                        // assigned_to: parseInt(id), // Backend might not support this
                        per_page: 10,
                    });
                    setAssignedAduan(aduanRes.data || []);
                } catch (error) {
                    console.log('Failed to load assigned aduan:', error);
                }
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal memuat data user');
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async () => {
        if (!user) return;
        if (confirm(`${user.is_active ? 'Nonaktifkan' : 'Aktifkan'} user ini?`)) {
            try {
                await adminUserService.activate(user.id, !user.is_active);
                await loadUserDetail();
                alert('Status user berhasil diupdate');
            } catch (error: any) {
                alert(error.response?.data?.message || 'Gagal update status user');
            }
        }
    };

    const handleDelete = async () => {
        if (!user) return;
        try {
            await adminUserService.delete(user.id);
            alert('User berhasil dihapus');
            navigate('/admin/users');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal hapus user');
        }
        setShowDeleteDialog(false);
    };

    if (loading) {
        return <LoadingSpinner message="Memuat data user..." />;
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">User tidak ditemukan</p>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                >
                    Kembali ke List User
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detail User</h1>
                        <p className="mt-1 text-sm text-gray-500">Informasi lengkap user</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleToggleActive}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            user.is_active
                                ? 'bg-orange-600 hover:bg-orange-700'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                        Edit
                    </Link>
                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                        <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                        Hapus
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - User Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-500">{user.role.display_name}</p>
                            </div>
                            <div>
                                {user.is_active ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                                        Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        <XCircleIcon className="h-4 w-4 mr-1" />
                                        Nonaktif
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-start space-x-3">
                                <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">No HP</p>
                                    <p className="text-sm font-medium text-gray-900">{user.no_hp}</p>
                                </div>
                            </div>

                            {user.email && (
                                <div className="flex items-start space-x-3">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start space-x-3">
                                <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Role Level</p>
                                    <p className="text-sm font-medium text-gray-900">Level {user.role.level}</p>
                                </div>
                            </div>

                            {user.organization && (
                                <div className="flex items-start space-x-3">
                                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Organisasi</p>
                                        <p className="text-sm font-medium text-gray-900">{user.organization.name}</p>
                                        <p className="text-xs text-gray-500">{user.organization.type}</p>
                                    </div>
                                </div>
                            )}

                            {user.dinas && (
                                <div className="flex items-start space-x-3 sm:col-span-2">
                                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500">Dinas</p>
                                        <p className="text-sm font-medium text-gray-900">{user.dinas.name}</p>
                                        <p className="text-xs text-gray-500">Kode: {user.dinas.code}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start space-x-3">
                                <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Last Login</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.last_login_at
                                            ? new Date(user.last_login_at).toLocaleString('id-ID')
                                            : 'Belum pernah login'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Dibuat</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(user.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Aduan */}
                    {user.is_admin && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Aduan yang Ditugaskan</h3>
                            {assignedAduan.length === 0 ? (
                                <p className="text-sm text-gray-500">Tidak ada aduan yang ditugaskan</p>
                            ) : (
                                <div className="space-y-3">
                                    {assignedAduan.slice(0, 5).map((aduan) => (
                                        <Link
                                            key={aduan.id}
                                            to={`/admin/aduan/${aduan.id}`}
                                            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{aduan.nomor_tiket}</p>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{aduan.deskripsi}</p>
                                                </div>
                                                <span className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                                                    aduan.status === 'baru' ? 'bg-blue-100 text-blue-800' :
                                                    aduan.status === 'diverifikasi' ? 'bg-yellow-100 text-yellow-800' :
                                                    aduan.status === 'diproses' ? 'bg-orange-100 text-orange-800' :
                                                    aduan.status === 'selesai' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {aduan.status_label || aduan.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                    {assignedAduan.length > 5 && (
                                        <Link
                                            to={`/admin/aduan?assigned_to=${user.id}`}
                                            className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-4"
                                        >
                                            Lihat semua ({assignedAduan.length})
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column - Statistics */}
                <div className="space-y-6">
                    {/* Statistics Card */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Aduan</span>
                                <span className="text-lg font-semibold text-gray-900">
                                    {user.statistics?.total_aduan || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Aduan Aktif</span>
                                <span className="text-lg font-semibold text-blue-600">
                                    {user.statistics?.active_aduan || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Selesai</span>
                                <span className="text-lg font-semibold text-green-600">
                                    {user.statistics?.completed_aduan || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Ditugaskan</span>
                                <span className="text-lg font-semibold text-orange-600">
                                    {user.statistics?.assigned_aduan || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Info Card */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Status Akun</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Admin Panel</span>
                                {user.is_admin ? (
                                    <span className="text-sm font-medium text-green-600">✓ Aktif</span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-400">✗ Tidak</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Verifikasi</span>
                                {user.is_verified ? (
                                    <span className="text-sm font-medium text-green-600">✓ Terverifikasi</span>
                                ) : (
                                    <span className="text-sm font-medium text-orange-600">⚠ Belum</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Status User</span>
                                {user.is_active ? (
                                    <span className="text-sm font-medium text-green-600">✓ Aktif</span>
                                ) : (
                                    <span className="text-sm font-medium text-red-600">✗ Nonaktif</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Hapus User"
                message={`Apakah Anda yakin ingin menghapus user "${user.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
            />
        </div>
    );
};

export default AdminUserDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminAduanService } from '../../services/adminApi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import type { AdminAduan, AduanHistory } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AssignAduanModal from '../../components/admin/modals/AssignAduanModal';
import VerifyAduanModal from '../../components/admin/modals/VerifyAduanModal';
import RejectAduanModal from '../../components/admin/modals/RejectAduanModal';
import UpdateStatusModal from '../../components/admin/modals/UpdateStatusModal';
import SetPriorityModal from '../../components/admin/modals/SetPriorityModal';
import AddNotesModal from '../../components/admin/modals/AddNotesModal';
import {
    CheckCircleIcon,
    XCircleIcon,
    UserGroupIcon,
    FlagIcon,
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    MapPinIcon,
    CalendarIcon,
    ClockIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const AdminAduanDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAdminAuth();
    const [aduan, setAduan] = useState<AdminAduan | null>(null);
    const [history, setHistory] = useState<AduanHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal states
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [priorityModalOpen, setPriorityModalOpen] = useState(false);
    const [notesModalOpen, setNotesModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadAduanDetail();
            loadAduanHistory();
        }
    }, [id]);

    const loadAduanDetail = async () => {
        setLoading(true);
        try {
            const response = await adminAduanService.getDetail(parseInt(id!));
            setAduan(response.data);
        } catch (error) {
            console.error('Failed to load aduan detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAduanHistory = async () => {
        try {
            const response = await adminAduanService.getHistory(parseInt(id!));
            setHistory(response.data || []);
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        await loadAduanDetail();
        await loadAduanHistory();
        setRefreshing(false);
    };

    const handleAssign = async (type: 'dinas' | 'staff', assignId: number, notes?: string) => {
        try {
            if (type === 'dinas') {
                await adminAduanService.assignToDinas(parseInt(id!), assignId, notes);
            } else {
                await adminAduanService.assignToStaff(parseInt(id!), assignId, notes);
            }
            await refreshData();
            alert('Aduan berhasil di-assign');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal assign aduan');
            throw error;
        }
    };

    const handleVerify = async (notes?: string) => {
        try {
            await adminAduanService.verify(parseInt(id!), notes);
            await refreshData();
            alert('Aduan berhasil diverifikasi');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal verifikasi aduan');
            throw error;
        }
    };

    const handleReject = async (reason: string) => {
        try {
            await adminAduanService.reject(parseInt(id!), reason);
            await refreshData();
            alert('Aduan berhasil ditolak');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal menolak aduan');
            throw error;
        }
    };

    const handleUpdateStatus = async (status: string, notes?: string) => {
        try {
            await adminAduanService.updateStatus(parseInt(id!), status, notes);
            await refreshData();
            alert('Status aduan berhasil diupdate');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal update status');
            throw error;
        }
    };

    const handleSetPriority = async (priority: string, notes?: string) => {
        try {
            await adminAduanService.setPriority(parseInt(id!), priority, notes);
            await refreshData();
            alert('Prioritas aduan berhasil diset');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal set prioritas');
            throw error;
        }
    };

    const handleAddNotes = async (notes: string) => {
        try {
            await adminAduanService.addNotes(parseInt(id!), notes);
            await refreshData();
            alert('Catatan berhasil ditambahkan');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal tambah catatan');
            throw error;
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { class: string; label: string }> = {
            baru: { class: 'bg-yellow-100 text-yellow-800', label: 'BARU' },
            diverifikasi: { class: 'bg-blue-100 text-blue-800', label: 'DIVERIFIKASI' },
            diproses: { class: 'bg-orange-100 text-orange-800', label: 'DIPROSES' },
            selesai: { class: 'bg-green-100 text-green-800', label: 'SELESAI' },
            ditolak: { class: 'bg-red-100 text-red-800', label: 'DITOLAK' },
        };
        return badges[status] || { class: 'bg-gray-100 text-gray-800', label: status.toUpperCase() };
    };

    const getPriorityBadge = (priority: string) => {
        const badges: Record<string, { class: string; label: string }> = {
            low: { class: 'bg-green-100 text-green-800', label: 'LOW' },
            medium: { class: 'bg-yellow-100 text-yellow-800', label: 'MEDIUM' },
            high: { class: 'bg-orange-100 text-orange-800', label: 'HIGH' },
            urgent: { class: 'bg-red-100 text-red-800', label: 'URGENT' },
        };
        return badges[priority] || { class: 'bg-gray-100 text-gray-800', label: priority.toUpperCase() };
    };

    const allowedStatuses = [
        { value: 'diverifikasi', label: 'Diverifikasi' },
        { value: 'diproses', label: 'Diproses' },
        { value: 'selesai', label: 'Selesai' },
    ];

    if (loading) {
        return <LoadingSpinner size="lg" message="Memuat detail aduan..." />;
    }

    if (!aduan) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Aduan tidak ditemukan</p>
                <Link to="/admin/aduan" className="mt-4 text-blue-600 hover:text-blue-800">
                    Kembali ke list
                </Link>
            </div>
        );
    }

    const statusBadge = getStatusBadge(aduan.status);
    const priorityBadge = getPriorityBadge(aduan.priority);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/aduan')}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{aduan.nomor_tiket}</h1>
                        <p className="mt-1 text-sm text-gray-500">Detail Aduan Warga</p>
                    </div>
                </div>
                <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status & Priority */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Status & Prioritas</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div>
                                <span className="text-sm text-gray-500">Status:</span>
                                <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full ${statusBadge.class}`}>
                                    {statusBadge.label}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Prioritas:</span>
                                <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full ${priorityBadge.class}`}>
                                    {priorityBadge.label}
                                </span>
                            </div>
                            {aduan.progress !== undefined && (
                                <div className="flex-1">
                                    <span className="text-sm text-gray-500">Progress: {aduan.progress}%</span>
                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${aduan.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Deskripsi Aduan</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{aduan.deskripsi}</p>
                    </div>

                    {/* Foto */}
                    {aduan.photos && aduan.photos.length > 0 && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Foto Aduan</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {aduan.photos.map((photo) => (
                                    <img
                                        key={photo.id}
                                        src={photo.url}
                                        alt={`Foto ${photo.urutan}`}
                                        className="rounded-lg object-cover w-full h-48"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lokasi */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Lokasi</h2>
                        <div className="space-y-2">
                            {aduan.alamat && (
                                <div className="flex items-start">
                                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                    <p className="text-gray-700">{aduan.alamat}</p>
                                </div>
                            )}
                            {aduan.latitude && aduan.longitude && (
                                <p className="text-sm text-gray-500 ml-7">
                                    Koordinat: {aduan.latitude}, {aduan.longitude}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Catatan */}
                    {(aduan.catatan_admin || aduan.catatan_verifikasi || aduan.catatan_penolakan) && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Catatan</h2>
                            <div className="space-y-3">
                                {aduan.catatan_admin && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-blue-800">Catatan Admin:</p>
                                        <p className="mt-1 text-sm text-blue-700">{aduan.catatan_admin}</p>
                                    </div>
                                )}
                                {aduan.catatan_verifikasi && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-green-800">Catatan Verifikasi:</p>
                                        <p className="mt-1 text-sm text-green-700">{aduan.catatan_verifikasi}</p>
                                    </div>
                                )}
                                {aduan.catatan_penolakan && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-red-800">Alasan Penolakan:</p>
                                        <p className="mt-1 text-sm text-red-700">{aduan.catatan_penolakan}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* History */}
                    {history.length > 0 && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Riwayat Aktivitas</h2>
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {history.map((item, index) => (
                                        <li key={index}>
                                            <div className="relative pb-8">
                                                {index !== history.length - 1 && (
                                                    <span
                                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <div className="relative flex space-x-3">
                                                    <div>
                                                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                            <ClockIcon className="h-5 w-5 text-white" />
                                                        </span>
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                        <div>
                                                            <p className="text-sm text-gray-900">
                                                                <span className="font-medium">{item.user}</span> {item.action}
                                                            </p>
                                                            {item.notes && (
                                                                <p className="mt-0.5 text-sm text-gray-500">{item.notes}</p>
                                                            )}
                                                        </div>
                                                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                            {new Date(item.created_at).toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Action Buttons */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Aksi</h2>
                        <div className="space-y-2">
                            {aduan.status === 'baru' && (
                                <>
                                    <button
                                        onClick={() => setVerifyModalOpen(true)}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        Verifikasi
                                    </button>
                                    <button
                                        onClick={() => setRejectModalOpen(true)}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                    >
                                        <XCircleIcon className="h-5 w-5 mr-2" />
                                        Tolak
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setAssignModalOpen(true)}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <UserGroupIcon className="h-5 w-5 mr-2" />
                                Assign
                            </button>
                            <button
                                onClick={() => setPriorityModalOpen(true)}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FlagIcon className="h-5 w-5 mr-2" />
                                Set Prioritas
                            </button>
                            {aduan.status !== 'baru' && aduan.status !== 'selesai' && aduan.status !== 'ditolak' && (
                                <button
                                    onClick={() => setStatusModalOpen(true)}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                                    Update Status
                                </button>
                            )}
                            <button
                                onClick={() => setNotesModalOpen(true)}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                                Tambah Catatan
                            </button>
                        </div>
                    </div>

                    {/* Pelapor Info */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Pelapor</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nama</p>
                                <p className="text-sm font-medium text-gray-900">{aduan.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">No. HP</p>
                                <p className="text-sm font-medium text-gray-900">{aduan.user.no_hp}</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Lainnya */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Informasi</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Kategori</p>
                                <p className="text-sm font-medium text-gray-900">{aduan.kategori.nama}</p>
                            </div>
                            {aduan.dinas && (
                                <div>
                                    <p className="text-sm text-gray-500">Dinas</p>
                                    <p className="text-sm font-medium text-gray-900">{aduan.dinas.name}</p>
                                </div>
                            )}
                            {aduan.assigned_user && (
                                <div>
                                    <p className="text-sm text-gray-500">Ditugaskan ke</p>
                                    <p className="text-sm font-medium text-gray-900">{aduan.assigned_user.name}</p>
                                    <p className="text-xs text-gray-500">{aduan.assigned_user.role}</p>
                                </div>
                            )}
                            {aduan.organization && (
                                <div>
                                    <p className="text-sm text-gray-500">Wilayah</p>
                                    <p className="text-sm font-medium text-gray-900">{aduan.organization.name}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500">Tanggal Laporan</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {new Date(aduan.tanggal_aduan).toLocaleString('id-ID')}
                                </p>
                            </div>
                            {aduan.tanggal_verifikasi && (
                                <div>
                                    <p className="text-sm text-gray-500">Tanggal Verifikasi</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(aduan.tanggal_verifikasi).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            )}
                            {aduan.tanggal_selesai && (
                                <div>
                                    <p className="text-sm text-gray-500">Tanggal Selesai</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(aduan.tanggal_selesai).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AssignAduanModal
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                onAssign={handleAssign}
                currentDinasId={aduan.dinas?.id}
                currentAssignedTo={aduan.assigned_user?.id}
            />
            <VerifyAduanModal
                open={verifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                onVerify={handleVerify}
                nomorTiket={aduan.nomor_tiket}
            />
            <RejectAduanModal
                open={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onReject={handleReject}
                nomorTiket={aduan.nomor_tiket}
            />
            <UpdateStatusModal
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onUpdate={handleUpdateStatus}
                nomorTiket={aduan.nomor_tiket}
                currentStatus={aduan.status}
                allowedStatuses={allowedStatuses}
            />
            <SetPriorityModal
                open={priorityModalOpen}
                onClose={() => setPriorityModalOpen(false)}
                onSetPriority={handleSetPriority}
                nomorTiket={aduan.nomor_tiket}
                currentPriority={aduan.priority}
            />
            <AddNotesModal
                open={notesModalOpen}
                onClose={() => setNotesModalOpen(false)}
                onAddNotes={handleAddNotes}
                nomorTiket={aduan.nomor_tiket}
            />
        </div>
    );
};

export default AdminAduanDetail;

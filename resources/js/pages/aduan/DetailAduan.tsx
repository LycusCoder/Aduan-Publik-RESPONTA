import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aduanService } from '../../services/api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { formatDate } from '../../utils/formatters';
import { useState } from 'react';
import type { Aduan, ApiResponse } from '../../types';

const DetailAduan = () => {
    const { nomorTiket } = useParams<{ nomorTiket: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Fetch aduan detail
    const { data: response, isLoading, error } = useQuery<ApiResponse<Aduan>>({
        queryKey: ['aduan', nomorTiket],
        queryFn: () => aduanService.getDetail(nomorTiket!),
        enabled: !!nomorTiket,
    });

    const aduan = response?.data;

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => aduanService.delete(nomorTiket!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aduan'] });
            setAlert({ type: 'success', message: 'Aduan berhasil dihapus' });
            setTimeout(() => navigate('/aduan'), 1500);
        },
        onError: (error: any) => {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Gagal menghapus aduan'
            });
        },
    });

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus aduan ini?')) {
            deleteMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat detail aduan...</p>
                </div>
            </div>
        );
    }

    if (error || !aduan) {
        return (
            <div className="text-center py-12">
                <span className="text-6xl mb-4 block">❌</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Aduan Tidak Ditemukan</h2>
                <p className="text-gray-600 mb-6">Aduan yang Anda cari tidak tersedia.</p>
                <Link to="/aduan">
                    <Button variant="primary">← Kembali ke Daftar Aduan</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/aduan" className="text-blue-600 hover:text-blue-700 font-medium">
                    ← Kembali
                </Link>
                <div className="flex space-x-3">
                    {aduan.status === 'baru' && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => navigate(`/aduan/${nomorTiket}/edit`)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Alert */}
            {alert && (
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            )}

            {/* Main Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {aduan.kategori?.nama}
                        </h1>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-mono font-semibold text-blue-600">
                                {aduan.nomor_tiket}
                            </span>
                            <Badge status={aduan.status} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Tanggal Aduan</p>
                        <p className="font-medium text-gray-900">{formatDate(aduan.created_at)}</p>
                    </div>
                    {aduan.tanggal_selesai && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tanggal Selesai</p>
                            <p className="font-medium text-gray-900">{formatDate(aduan.tanggal_selesai)}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Nama Pelapor</p>
                        <p className="font-medium text-gray-900">{aduan.user?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Nomor HP</p>
                        <p className="font-medium text-gray-900">{aduan.user?.no_hp}</p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Deskripsi Keluhan</h3>
                    <p className="text-gray-700 leading-relaxed">{aduan.deskripsi}</p>
                </div>

                {aduan.catatan_admin && (
                    <div className="border-t pt-6 mt-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Catatan Admin</h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-gray-700">{aduan.catatan_admin}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Photos */}
            {aduan.fotos && aduan.fotos.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Foto Bukti</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aduan.fotos.map((foto) => (
                            <div
                                key={foto.id}
                                className="relative cursor-pointer group"
                                onClick={() => setSelectedImage(foto.url)}
                            >
                                <img
                                    src={foto.url}
                                    alt={`Foto ${foto.urutan}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition rounded-lg flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 transition text-2xl">
                                        🔍
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Lokasi</h3>
                <div className="space-y-3">
                    {aduan.lokasi?.alamat && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-900">
                                <span className="font-medium">📍 Alamat:</span> {aduan.lokasi.alamat}
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Latitude</p>
                            <p className="font-mono text-sm font-medium text-gray-900">
                                {aduan.lokasi?.latitude}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Longitude</p>
                            <p className="font-mono text-sm font-medium text-gray-900">
                                {aduan.lokasi?.longitude}
                            </p>
                        </div>
                    </div>
                    {aduan.lokasi?.latitude && aduan.lokasi?.longitude && (
                        <a
                            href={`https://www.google.com/maps?q=${aduan.lokasi.latitude},${aduan.lokasi.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Buka di Google Maps →
                        </a>
                    )}
                </div>
            </div>

            {/* Image Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-screen">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                        >
                            ✕
                        </button>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-screen object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailAduan;

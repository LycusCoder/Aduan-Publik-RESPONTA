import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { kategoriService, aduanService } from '../../services/api';
import MapPicker from '../../components/map/MapPicker';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import type { KategoriAduan, ApiResponse, Location } from '../../types';

interface FormData {
    kategori_aduan_id: string;
    deskripsi: string;
    latitude: number | null;
    longitude: number | null;
    alamat: string;
}

interface FormErrors {
    kategori_aduan_id?: string;
    deskripsi?: string;
    lokasi?: string;
    fotos?: string;
}

const CreateAduan = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        kategori_aduan_id: '',
        deskripsi: '',
        latitude: null,
        longitude: null,
        alamat: '',
    });
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Fetch kategori aduan
    const { data: kategoriResponse, isLoading: loadingKategori } = useQuery<ApiResponse<KategoriAduan[]>>({
        queryKey: ['kategori'],
        queryFn: kategoriService.getAll,
    });

    const kategoriList = kategoriResponse?.data?.filter((k) => k.is_active) || [];

    // Create aduan mutation
    const createMutation = useMutation({
        mutationFn: (data: FormData) => aduanService.create(data as any),
        onSuccess: () => {
            setAlert({ type: 'success', message: 'Aduan berhasil dibuat!' });
            setTimeout(() => navigate('/aduan'), 1500);
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Gagal membuat aduan';
            const validationErrors = error.response?.data?.errors || {};
            setErrors(validationErrors);
            setAlert({ type: 'error', message: errorMessage });
        },
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleLocationSelect = (location: Location) => {
        setFormData((prev) => ({
            ...prev,
            latitude: location.latitude,
            longitude: location.longitude,
        }));
        if (errors.lokasi) {
            setErrors((prev) => ({ ...prev, lokasi: undefined }));
        }
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        const currentTotal = photos.length + fileArray.length;

        if (currentTotal > 3) {
            setErrors((prev) => ({ ...prev, fotos: 'Maksimal 3 foto' }));
            return;
        }

        // Validate file size (max 5MB each)
        const invalidFiles = fileArray.filter((file) => file.size > 5 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            setErrors((prev) => ({ ...prev, fotos: 'Ukuran file maksimal 5MB' }));
            return;
        }

        // Add photos
        setPhotos((prev) => [...prev, ...fileArray]);

        // Generate previews
        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        if (errors.fotos) {
            setErrors((prev) => ({ ...prev, fotos: undefined }));
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
        setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.kategori_aduan_id) {
            newErrors.kategori_aduan_id = 'Pilih kategori aduan';
        }

        if (!formData.deskripsi || formData.deskripsi.trim().length < 10) {
            newErrors.deskripsi = 'Deskripsi minimal 10 karakter';
        }

        if (!formData.latitude || !formData.longitude) {
            newErrors.lokasi = 'Pilih lokasi di peta';
        }

        if (photos.length === 0) {
            newErrors.fotos = 'Minimal 1 foto';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAlert(null);

        if (!validateForm()) {
            setAlert({ type: 'error', message: 'Mohon lengkapi semua field yang wajib diisi' });
            return;
        }

        // Prepare FormData
        const submitData = new FormData();
        submitData.append('kategori_aduan_id', formData.kategori_aduan_id);
        submitData.append('deskripsi', formData.deskripsi);
        submitData.append('latitude', formData.latitude!.toString());
        submitData.append('longitude', formData.longitude!.toString());
        submitData.append('alamat', formData.alamat || '');

        // Append photos
        photos.forEach((photo) => {
            submitData.append('fotos[]', photo);
        });

        createMutation.mutate(submitData as any);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Aduan Baru</h1>
                <p className="text-gray-600">Laporkan keluhan infrastruktur kota Anda</p>
            </div>

            {alert && (
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {/* Kategori Aduan */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori Aduan <span className="text-red-500">*</span>
                    </label>
                    {loadingKategori ? (
                        <div className="text-gray-500 text-sm">Memuat kategori...</div>
                    ) : (
                        <select
                            name="kategori_aduan_id"
                            value={formData.kategori_aduan_id}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                errors.kategori_aduan_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {kategoriList.map((kategori) => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.nama}
                                </option>
                            ))}
                        </select>
                    )}
                    {errors.kategori_aduan_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.kategori_aduan_id}</p>
                    )}
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Keluhan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleInputChange}
                        rows={5}
                        maxLength={500}
                        placeholder="Jelaskan keluhan Anda secara detail..."
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
                            errors.deskripsi ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm ${
                            errors.deskripsi ? 'text-red-500' : 'text-gray-500'
                        }`}>
                            {errors.deskripsi || `${formData.deskripsi.length}/500 karakter`}
                        </p>
                    </div>
                </div>

                {/* Lokasi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi Kejadian <span className="text-red-500">*</span>
                    </label>
                    <MapPicker onLocationSelect={handleLocationSelect} />
                    {errors.lokasi && (
                        <p className="text-red-500 text-sm mt-2">{errors.lokasi}</p>
                    )}
                </div>

                {/* Alamat (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap (Opsional)
                    </label>
                    <Input
                        type="text"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        placeholder="Contoh: Jl. Merdeka No. 10, RT 01/RW 02"
                    />
                </div>

                {/* Foto */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Bukti <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-3">Upload minimal 1 foto, maksimal 3 foto (maks. 5MB per foto)</p>
                    
                    {/* Photo Previews */}
                    {photoPreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {photoPreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    {photos.length < 3 && (
                        <label className="cursor-pointer">
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition ${
                                errors.fotos ? 'border-red-500' : 'border-gray-300'
                            }`}>
                                <span className="text-4xl mb-2 block">📷</span>
                                <p className="text-gray-600 text-sm">Klik untuk upload foto</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                    )}
                    {errors.fotos && (
                        <p className="text-red-500 text-sm mt-2">{errors.fotos}</p>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center space-x-4 pt-4 border-t">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={createMutation.isPending}
                        className="flex-1"
                    >
                        {createMutation.isPending ? 'Mengirim...' : 'Kirim Aduan'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/aduan')}
                        disabled={createMutation.isPending}
                    >
                        Batal
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateAduan;

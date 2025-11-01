import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminUserService, organizationService, dinasService } from '../../services/adminApi';
import type { AdminUser, AdminUserFilters, Role, Organization, Dinas } from '../../types';
import DataTable from '../../components/ui/DataTable';
import ExportButton from '../../components/ui/ExportButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatDataForExport, exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportHelpers';
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminUserList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState<AdminUser[]>([]);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

    // Filter states
    const [filters, setFilters] = useState<AdminUserFilters>({
        role_id: searchParams.get('role_id') || '',
        organization_id: searchParams.get('organization_id') || '',
        dinas_id: searchParams.get('dinas_id') || '',
        is_active: searchParams.get('is_active') === 'true' ? true : searchParams.get('is_active') === 'false' ? false : undefined,
        search: searchParams.get('search') || '',
        page: parseInt(searchParams.get('page') || '1'),
        per_page: 15,
        sort_by: searchParams.get('sort_by') || 'created_at',
        sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
    });

    // Data for filters
    const [roleList, setRoleList] = useState<Role[]>([]);
    const [organizationList, setOrganizationList] = useState<Organization[]>([]);
    const [dinasList, setDinasList] = useState<Dinas[]>([]);

    useEffect(() => {
        loadUserList();
    }, [filters]);

    useEffect(() => {
        loadFilterData();
    }, []);

    const loadUserList = async () => {
        setLoading(true);
        try {
            const response = await adminUserService.getList(filters);
            setUserList(response.data || []);
            setTotal(response.meta?.total || 0);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFilterData = async () => {
        try {
            const [rolesRes, orgRes, dinasRes] = await Promise.all([
                adminUserService.getRoles(),
                organizationService.getList({ active_only: true }),
                dinasService.getList({ active_only: true }),
            ]);
            setRoleList(rolesRes.data || []);
            setOrganizationList(orgRes.data || []);
            setDinasList(dinasRes.data || []);
        } catch (error) {
            console.error('Failed to load filter data:', error);
        }
    };

    const handleFilterChange = (key: keyof AdminUserFilters, value: any) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        updateSearchParams(newFilters);
    };

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        const newFilters = { ...filters, sort_by: key, sort_order: direction };
        setFilters(newFilters);
        updateSearchParams(newFilters);
    };

    const updateSearchParams = (newFilters: AdminUserFilters) => {
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') params.set(key, value.toString());
        });
        setSearchParams(params);
    };

    const handleToggleActive = async (userId: number, currentStatus: boolean) => {
        if (confirm(`${currentStatus ? 'Nonaktifkan' : 'Aktifkan'} user ini?`)) {
            try {
                await adminUserService.activate(userId, !currentStatus);
                await loadUserList();
                alert('Status user berhasil diupdate');
            } catch (error: any) {
                alert(error.response?.data?.message || 'Gagal update status user');
            }
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteUserId) return;
        try {
            await adminUserService.delete(deleteUserId);
            await loadUserList();
            alert('User berhasil dihapus');
            setDeleteUserId(null);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal hapus user');
        }
    };

    const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
        const exportData = formatDataForExport(userList, [
            { key: 'name', label: 'Nama' },
            { key: 'no_hp', label: 'No HP' },
            { key: 'role.display_name', label: 'Role' },
            { key: 'organization.name', label: 'Organisasi' },
            { key: 'dinas.name', label: 'Dinas' },
            { key: 'is_active', label: 'Status' },
            { key: 'created_at', label: 'Tanggal Dibuat' },
        ]);

        if (format === 'excel') {
            await exportToExcel(exportData, `users-${new Date().toISOString().split('T')[0]}`);
        } else if (format === 'csv') {
            exportToCSV(exportData, `users-${new Date().toISOString().split('T')[0]}`);
        } else if (format === 'pdf') {
            await exportToPDF(exportData, `users-${new Date().toISOString().split('T')[0]}`);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Nama',
            sortable: true,
            render: (item: AdminUser) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.no_hp}</div>
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (item: AdminUser) => (
                <div>
                    <div className="text-sm text-gray-900">{item.role.display_name}</div>
                    <div className="text-xs text-gray-500">Level {item.role.level}</div>
                </div>
            ),
        },
        {
            key: 'organization',
            label: 'Organisasi',
            render: (item: AdminUser) => (
                <span className="text-sm text-gray-900">{item.organization?.name || '-'}</span>
            ),
        },
        {
            key: 'dinas',
            label: 'Dinas',
            render: (item: AdminUser) => (
                <span className="text-sm text-gray-900">{item.dinas?.name || '-'}</span>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (item: AdminUser) => (
                <button
                    onClick={() => handleToggleActive(item.id, item.is_active)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                >
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                </button>
            ),
        },
        {
            key: 'statistics',
            label: 'Statistik',
            render: (item: AdminUser) => (
                <div className="text-xs text-gray-500">
                    <div>Total: {item.statistics?.total_aduan || 0}</div>
                    <div>Aktif: {item.statistics?.active_aduan || 0}</div>
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (item: AdminUser) => (
                <div className="flex space-x-2">
                    <Link
                        to={`/admin/users/${item.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Detail"
                    >
                        <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                        to={`/admin/users/${item.id}/edit`}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                        onClick={() => setDeleteUserId(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
                    <p className="mt-1 text-sm text-gray-500">Total: {total} user</p>
                </div>
                <div className="flex space-x-3">
                    <ExportButton onExport={handleExport} disabled={userList.length === 0} />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                        Filter
                    </button>
                    <Link
                        to="/admin/users/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Tambah User
                    </Link>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cari</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.search || ''}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Cari nama, no HP..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={filters.role_id || ''}
                                onChange={(e) => handleFilterChange('role_id', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Role</option>
                                {roleList.map((role) => (
                                    <option key={role.id} value={role.id}>{role.display_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={filters.is_active === true ? 'true' : filters.is_active === false ? 'false' : ''}
                                onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value === 'true')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="true">Aktif</option>
                                <option value="false">Nonaktif</option>
                            </select>
                        </div>

                        {/* Organization */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organisasi</label>
                            <select
                                value={filters.organization_id || ''}
                                onChange={(e) => handleFilterChange('organization_id', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Organisasi</option>
                                {organizationList.map((org) => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dinas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dinas</label>
                            <select
                                value={filters.dinas_id || ''}
                                onChange={(e) => handleFilterChange('dinas_id', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Semua Dinas</option>
                                {dinasList.map((dinas) => (
                                    <option key={dinas.id} value={dinas.id}>{dinas.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                setFilters({
                                    page: 1,
                                    per_page: 15,
                                    sort_by: 'created_at',
                                    sort_order: 'desc',
                                });
                                setSearchParams(new URLSearchParams());
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="Memuat data user..." />
                ) : (
                    <DataTable
                        data={userList}
                        columns={columns}
                        keyExtractor={(item) => item.id}
                        onSort={handleSort}
                        emptyMessage="Tidak ada data user"
                    />
                )}
            </div>

            {/* Pagination */}
            {total > filters.per_page! && (
                <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handleFilterChange('page', filters.page! - 1)}
                            disabled={filters.page === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handleFilterChange('page', filters.page! + 1)}
                            disabled={filters.page! * filters.per_page! >= total}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Menampilkan{' '}
                                <span className="font-medium">{(filters.page! - 1) * filters.per_page! + 1}</span> sampai{' '}
                                <span className="font-medium">
                                    {Math.min(filters.page! * filters.per_page!, total)}
                                </span>{' '}
                                dari <span className="font-medium">{total}</span> hasil
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => handleFilterChange('page', filters.page! - 1)}
                                    disabled={filters.page === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                                    {filters.page}
                                </span>
                                <button
                                    onClick={() => handleFilterChange('page', filters.page! + 1)}
                                    disabled={filters.page! * filters.per_page! >= total}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteUserId !== null}
                onClose={() => setDeleteUserId(null)}
                onConfirm={handleDeleteUser}
                title="Hapus User"
                message="Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan."
                confirmLabel="Hapus"
                cancelLabel="Batal"
            />
        </div>
    );
};

export default AdminUserList;

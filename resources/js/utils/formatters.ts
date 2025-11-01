export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export const formatPhoneNumber = (phone: string): string => {
    // Format: 0812-3456-7890
    if (!phone) return '';
    return phone.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
};

export const getStatusBadgeColor = (status: string): string => {
    const colors: Record<string, string> = {
        'baru': 'bg-blue-100 text-blue-800',
        'diverifikasi': 'bg-yellow-100 text-yellow-800',
        'diproses': 'bg-purple-100 text-purple-800',
        'selesai': 'bg-green-100 text-green-800',
        'ditolak': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        'baru': 'Baru',
        'diverifikasi': 'Diverifikasi',
        'diproses': 'Diproses',
        'selesai': 'Selesai',
        'ditolak': 'Ditolak',
    };
    return labels[status] || status;
};
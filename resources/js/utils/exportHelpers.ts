// Export helpers for Excel, CSV, and PDF generation
// Note: In production, you may want to use libraries like:
// - xlsx or exceljs for Excel
// - jsPDF for PDF
// - Papa Parse for CSV

export const exportToExcel = async (data: any[], filename: string) => {
    // TODO: Implement with xlsx library
    // For now, we'll export as CSV which Excel can open
    return exportToCSV(data, filename);
};

export const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
        throw new Error('No data to export');
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                const stringValue = value?.toString() || '';
                return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = async (data: any[], filename: string) => {
    // TODO: Implement with jsPDF library
    // For MVP, we'll just alert that it's not implemented yet
    alert('PDF export will be implemented with jsPDF library. For now, please use CSV or Excel export.');
    throw new Error('PDF export not yet implemented');
};

// Format data for export
export const formatDataForExport = (data: any[], columns: { key: string; label: string }[]) => {
    return data.map(item => {
        const formatted: Record<string, any> = {};
        columns.forEach(col => {
            formatted[col.label] = item[col.key];
        });
        return formatted;
    });
};

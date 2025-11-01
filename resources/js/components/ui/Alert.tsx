interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

const Alert = ({ type = 'info', message, onClose }: AlertProps) => {
    const types: Record<string, string> = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const icons: Record<string, string> = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    if (!message) return null;

    return (
        <div className={`border rounded-lg p-4 ${types[type]} flex items-start justify-between`}>
            <div className="flex items-start space-x-3">
                <span className="text-lg font-bold">{icons[type]}</span>
                <p className="text-sm">{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;
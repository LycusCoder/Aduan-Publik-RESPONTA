import { getStatusBadgeColor, getStatusLabel } from '../../utils/formatters';

interface BadgeProps {
    status: string;
}

const Badge = ({ status }: BadgeProps) => {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
};

export default Badge;
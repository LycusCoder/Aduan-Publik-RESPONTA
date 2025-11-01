import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
    name: string;
    path?: string;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    const location = useLocation();

    // Auto-generate breadcrumbs from path if not provided
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const paths = location.pathname.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [];
        
        let currentPath = '';
        paths.forEach((path, index) => {
            currentPath += `/${path}`;
            
            // Skip 'admin' from breadcrumb display
            if (path === 'admin') return;
            
            // Capitalize and format the path name
            const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
            
            breadcrumbs.push({
                name,
                path: index === paths.length - 1 ? undefined : currentPath,
            });
        });
        
        return breadcrumbs;
    };

    const breadcrumbs = items || generateBreadcrumbs();

    if (breadcrumbs.length === 0) return null;

    return (
        <nav className="flex border-b border-gray-200 bg-white px-6 py-3" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        to="/admin/dashboard"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {breadcrumbs.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {item.path ? (
                            <Link
                                to={item.path}
                                className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <span className="ml-2 text-sm font-medium text-gray-900">
                                {item.name}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
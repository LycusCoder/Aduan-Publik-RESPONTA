import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import Breadcrumb from './Breadcrumb';

interface AdminLayoutProps {
    children: ReactNode;
    breadcrumbItems?: Array<{ name: string; path?: string }>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, breadcrumbItems }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <AdminHeader />

                {/* Breadcrumb */}
                {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
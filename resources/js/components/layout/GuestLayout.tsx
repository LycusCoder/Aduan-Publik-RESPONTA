import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

const GuestLayout = ({ children }: GuestLayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">R</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">RESPONTA</span>
                        </Link>

                        {/* Right side text */}
                        <div className="text-sm text-gray-600">
                            Sistem Pelaporan Aduan Warga
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/80 backdrop-blur-sm border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-gray-600 text-sm">
                        © {new Date().getFullYear()} RESPONTA. Made with ❤️ for better city infrastructure.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default GuestLayout;
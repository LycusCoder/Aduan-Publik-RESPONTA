import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const Forbidden: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full text-center">
                {/* Animated Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full animate-pulse">
                        <ShieldExclamationIcon className="h-16 w-16 text-red-600" />
                    </div>
                </div>

                {/* 403 Number */}
                <div className="mb-6">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        403
                    </h1>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Akses Ditolak
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                </p>

                {/* Branding Badge */}
                <div className="mb-8">
                    <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
                        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                            RESPONTA - Kota Tegal
                        </span>
                    </div>
                </div>

                {/* Info Box */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 text-left">
                                <h3 className="text-sm font-medium text-red-800">
                                    Kemungkinan Penyebab:
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Anda belum login ke sistem</li>
                                        <li>Role Anda tidak memiliki akses ke halaman ini</li>
                                        <li>Sesi Anda telah berakhir</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <ArrowLeftIcon className="-ml-1 mr-3 h-5 w-5" />
                        Kembali
                    </button>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <HomeIcon className="-ml-1 mr-3 h-5 w-5" />
                        Login
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-12 text-xs text-gray-400">
                    <p>© 2025 RESPONTA - Sistem Pelaporan Aduan Warga</p>
                    <p className="mt-1">Transformasi Digital Kota Tegal, Jawa Tengah</p>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;

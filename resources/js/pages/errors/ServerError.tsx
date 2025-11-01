import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ServerError: React.FC = () => {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full text-center">
                {/* Animated Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-purple-100 rounded-full animate-pulse">
                        <ExclamationTriangleIcon className="h-16 w-16 text-purple-600" />
                    </div>
                </div>

                {/* 500 Number */}
                <div className="mb-6">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        500
                    </h1>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Terjadi Kesalahan Server
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
                    Maaf, terjadi kesalahan pada server kami.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    Tim teknis kami telah mendapat notifikasi dan sedang menangani masalah ini.
                </p>

                {/* Branding Badge */}
                <div className="mb-8">
                    <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
                        <svg className="h-6 w-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                            RESPONTA - Kota Tegal
                        </span>
                    </div>
                </div>

                {/* Info Box */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 text-left">
                                <h3 className="text-sm font-medium text-purple-800">
                                    Apa yang bisa Anda lakukan?
                                </h3>
                                <div className="mt-2 text-sm text-purple-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Refresh halaman ini dalam beberapa saat</li>
                                        <li>Kembali ke halaman sebelumnya</li>
                                        <li>Hubungi support jika masalah berlanjut</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowPathIcon className={`-ml-1 mr-3 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Memuat...' : 'Refresh Halaman'}
                    </button>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <HomeIcon className="-ml-1 mr-3 h-5 w-5" />
                        Ke Dashboard
                    </Link>
                </div>

                {/* Support Info */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <p className="text-sm text-gray-500 mb-2">Butuh bantuan?</p>
                    <p className="text-sm text-gray-600">
                        Hubungi Tim Support: <a href="mailto:support@respontategal.id" className="text-purple-600 hover:text-purple-800 font-medium">support@respontategal.id</a>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-xs text-gray-400">
                    <p>© 2025 RESPONTA - Sistem Pelaporan Aduan Warga</p>
                    <p className="mt-1">Transformasi Digital Kota Tegal, Jawa Tengah</p>
                </div>
            </div>
        </div>
    );
};

export default ServerError;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full text-center">
                {/* Animated SVG Illustration */}
                <div className="mb-8 animate-bounce-slow">
                    <svg
                        className="mx-auto h-64 w-64 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={0.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                {/* 404 Number */}
                <div className="mb-6">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                        404
                    </h1>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Halaman Tidak Ditemukan
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
                    Maaf, halaman yang Anda cari tidak dapat ditemukan dalam sistem.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
                </p>

                {/* Branding Badge */}
                <div className="mb-8">
                    <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
                        <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                            RESPONTA - Kota Tegal
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <ArrowLeftIcon className="-ml-1 mr-3 h-5 w-5" />
                        Kembali
                    </button>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <HomeIcon className="-ml-1 mr-3 h-5 w-5" />
                        Ke Dashboard
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <p className="text-sm text-gray-500 mb-4">Atau kunjungi halaman populer:</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/aduan"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                            Daftar Aduan
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link
                            to="/aduan/create"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                            Buat Aduan Baru
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link
                            to="/login"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </div>
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

export default NotFound;

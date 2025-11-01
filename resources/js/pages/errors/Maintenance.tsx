import React, { useState, useEffect } from 'react';
import { WrenchScrewdriverIcon, ClockIcon } from '@heroicons/react/24/outline';

const Maintenance: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-teal-700 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-4xl w-full text-center relative z-10">
                {/* Logo/Badge */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 backdrop-blur-lg rounded-full border-4 border-white border-opacity-30">
                        <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                    RESPONTA
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                    Sistem Pelaporan Aduan Warga
                </p>

                {/* Animated Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-white bg-opacity-20 backdrop-blur-lg rounded-full animate-bounce-slow">
                        <WrenchScrewdriverIcon className="h-16 w-16 text-white" />
                    </div>
                </div>

                {/* Status Message */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Sedang Dalam Perbaikan
                </h2>

                <p className="text-lg text-blue-100 mb-2 max-w-2xl mx-auto">
                    Kami sedang melakukan pemeliharaan sistem untuk meningkatkan layanan.
                </p>
                <p className="text-blue-200 mb-12">
                    Mohon maaf atas ketidaknyamanannya. Sistem akan kembali online dalam waktu dekat.
                </p>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                        <WrenchScrewdriverIcon className="h-8 w-8 text-white mx-auto mb-3" />
                        <h3 className="text-white font-semibold mb-2">Maintenance Terjadwal</h3>
                        <p className="text-blue-100 text-sm">Update sistem & optimasi performa</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                        <ClockIcon className="h-8 w-8 text-white mx-auto mb-3" />
                        <h3 className="text-white font-semibold mb-2">Estimasi Waktu</h3>
                        <p className="text-blue-100 text-sm">1-2 jam (akan segera selesai)</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                        <svg className="h-8 w-8 text-white mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-white font-semibold mb-2">Status Update</h3>
                        <p className="text-blue-100 text-sm">Cek kembali dalam beberapa saat</p>
                    </div>
                </div>

                {/* Current Time Display */}
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20 max-w-md mx-auto mb-8">
                    <p className="text-blue-100 text-sm mb-2">Waktu Saat Ini</p>
                    <p className="text-white text-2xl font-bold font-mono">
                        {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <p className="text-blue-200 text-sm mt-1">
                        {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Branding */}
                <div className="border-t border-white border-opacity-20 pt-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white font-semibold">Kota Tegal</span>
                    </div>
                    <p className="text-blue-200 text-sm">
                        Transformasi Digital untuk Pelayanan Publik yang Lebih Baik
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-sm text-blue-200">
                    <p>© 2025 RESPONTA - Sistem Pelaporan Aduan Warga</p>
                    <p className="mt-1">Pemerintah Kota Tegal, Jawa Tengah</p>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;

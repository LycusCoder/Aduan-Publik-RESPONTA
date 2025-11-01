import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ExportButtonProps {
    onExport: (format: 'excel' | 'pdf' | 'csv') => Promise<void>;
    disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled = false }) => {
    const [exporting, setExporting] = useState(false);

    const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
        setExporting(true);
        try {
            await onExport(format);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button
                    disabled={disabled || exporting}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                    {exporting ? 'Exporting...' : 'Export'}
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleExport('excel')}
                                    className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full px-4 py-2 text-left text-sm`}
                                >
                                    Export to Excel
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleExport('csv')}
                                    className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full px-4 py-2 text-left text-sm`}
                                >
                                    Export to CSV
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full px-4 py-2 text-left text-sm`}
                                >
                                    Export to PDF
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default ExportButton;

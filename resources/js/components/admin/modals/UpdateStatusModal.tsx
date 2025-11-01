import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UpdateStatusModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (status: string, notes?: string) => Promise<void>;
    nomorTiket: string;
    currentStatus: string;
    allowedStatuses: Array<{ value: string; label: string }>;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
    open,
    onClose,
    onUpdate,
    nomorTiket,
    currentStatus,
    allowedStatuses,
}) => {
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!status) {
            alert('Pilih status terlebih dahulu');
            return;
        }

        setLoading(true);
        try {
            await onUpdate(status, notes);
            handleClose();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStatus('');
        setNotes('');
        onClose();
    };

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 pr-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ArrowPathIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                            Update Status Aduan
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Update status aduan <span className="font-semibold">{nomorTiket}</span>
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Status saat ini: <span className="font-semibold uppercase">{currentStatus}</span>
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                            <div>
                                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                                    Status Baru
                                                </label>
                                                <select
                                                    id="status"
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="">Pilih Status</option>
                                                    {allowedStatuses.map((s) => (
                                                        <option key={s.value} value={s.value}>
                                                            {s.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                                    Catatan (Opsional)
                                                </label>
                                                <textarea
                                                    id="notes"
                                                    rows={3}
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    placeholder="Tambahkan catatan..."
                                                />
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto disabled:opacity-50"
                                                >
                                                    {loading ? 'Memproses...' : 'Update Status'}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={loading}
                                                    onClick={handleClose}
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default UpdateStatusModal;

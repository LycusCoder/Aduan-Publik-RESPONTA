import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dinas, AdminUser } from '../../../types';
import { dinasService, adminUserService } from '../../../services/adminApi';

interface AssignAduanModalProps {
    open: boolean;
    onClose: () => void;
    onAssign: (type: 'dinas' | 'staff', id: number, notes?: string) => Promise<void>;
    currentDinasId?: number;
    currentAssignedTo?: number;
}

const AssignAduanModal: React.FC<AssignAduanModalProps> = ({
    open,
    onClose,
    onAssign,
    currentDinasId,
    currentAssignedTo,
}) => {
    const [assignType, setAssignType] = useState<'dinas' | 'staff'>('dinas');
    const [selectedDinasId, setSelectedDinasId] = useState<string>('');
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [dinasList, setDinasList] = useState<Dinas[]>([]);
    const [staffList, setStaffList] = useState<AdminUser[]>([]);

    useEffect(() => {
        if (open) {
            loadDinas();
            if (currentDinasId) {
                setSelectedDinasId(currentDinasId.toString());
            }
            if (currentAssignedTo) {
                setSelectedStaffId(currentAssignedTo.toString());
            }
        }
    }, [open, currentDinasId, currentAssignedTo]);

    useEffect(() => {
        if (selectedDinasId && assignType === 'staff') {
            loadStaff(parseInt(selectedDinasId));
        }
    }, [selectedDinasId, assignType]);

    const loadDinas = async () => {
        setLoadingData(true);
        try {
            const response = await dinasService.getList({ active_only: true });
            setDinasList(response.data || []);
        } catch (error) {
            console.error('Failed to load dinas:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const loadStaff = async (dinasId: number) => {
        setLoadingData(true);
        try {
            const response = await dinasService.getStaff(dinasId);
            setStaffList(response.data || []);
        } catch (error) {
            console.error('Failed to load staff:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (assignType === 'dinas' && !selectedDinasId) {
            alert('Pilih dinas terlebih dahulu');
            return;
        }
        
        if (assignType === 'staff' && !selectedStaffId) {
            alert('Pilih staff terlebih dahulu');
            return;
        }

        setLoading(true);
        try {
            const id = assignType === 'dinas' ? parseInt(selectedDinasId) : parseInt(selectedStaffId);
            await onAssign(assignType, id, notes);
            handleClose();
        } catch (error) {
            console.error('Failed to assign:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAssignType('dinas');
        setSelectedDinasId('');
        setSelectedStaffId('');
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
                                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                            Assign Aduan
                                        </Dialog.Title>

                                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                            {/* Assign Type */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Assign Ke</label>
                                                <div className="mt-2 flex space-x-4">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            value="dinas"
                                                            checked={assignType === 'dinas'}
                                                            onChange={() => setAssignType('dinas')}
                                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Dinas</span>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            value="staff"
                                                            checked={assignType === 'staff'}
                                                            onChange={() => setAssignType('staff')}
                                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Staff</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Dinas Selection */}
                                            <div>
                                                <label htmlFor="dinas" className="block text-sm font-medium text-gray-700">
                                                    Pilih Dinas
                                                </label>
                                                <select
                                                    id="dinas"
                                                    value={selectedDinasId}
                                                    onChange={(e) => setSelectedDinasId(e.target.value)}
                                                    disabled={loadingData}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    <option value="">Pilih Dinas</option>
                                                    {dinasList.map((dinas) => (
                                                        <option key={dinas.id} value={dinas.id}>
                                                            {dinas.name} ({dinas.code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Staff Selection */}
                                            {assignType === 'staff' && selectedDinasId && (
                                                <div>
                                                    <label htmlFor="staff" className="block text-sm font-medium text-gray-700">
                                                        Pilih Staff
                                                    </label>
                                                    <select
                                                        id="staff"
                                                        value={selectedStaffId}
                                                        onChange={(e) => setSelectedStaffId(e.target.value)}
                                                        disabled={loadingData}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    >
                                                        <option value="">Pilih Staff</option>
                                                        {staffList.map((staff) => (
                                                            <option key={staff.id} value={staff.id}>
                                                                {staff.name} ({staff.role.display_name})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* Notes */}
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

                                            {/* Buttons */}
                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={loading || loadingData}
                                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto disabled:opacity-50"
                                                >
                                                    {loading ? 'Memproses...' : 'Assign'}
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

export default AssignAduanModal;

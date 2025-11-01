import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
    BellIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const AdminHeader: React.FC = () => {
    const { user, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Left side - could add breadcrumb or page title here */}
                <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {/* Page title can be passed as prop if needed */}
                    </h2>
                </div>

                {/* Right side - notifications and user menu */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button
                        type="button"
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* User menu dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <span className="sr-only">Open user menu</span>
                            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.role.display_name}</p>
                                    <p className="text-xs text-gray-400 truncate mt-1">{user?.email || user?.no_hp}</p>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate('/admin/profile')}
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                Profil Saya
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate('/admin/settings')}
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                            >
                                                <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                Pengaturan
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="border-t border-gray-100 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`${
                                                    active ? 'bg-gray-100' : ''
                                                } flex w-full items-center px-4 py-2 text-sm text-red-700`}
                                            >
                                                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-500" aria-hidden="true" />
                                                Keluar
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
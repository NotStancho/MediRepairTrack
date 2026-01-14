import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { IconType } from 'react-icons';
import { FiFileText, FiUsers, FiTool, FiTruck, FiDollarSign, FiCreditCard, FiPackage, FiClipboard, FiUser, FiMenu, FiBriefcase  } from 'react-icons/fi';

type MenuItem = {
    to: string;
    label: string;
    icon: IconType;
};

interface Props {
    collapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: Props) {
    const { user } = useAuth();
    const { pathname } = useLocation();

    if (!user) return null;

    const menu: MenuItem[] = [];

    // CLIENT
    if (user.role === 'CLIENT') {
        menu.push(
            { to: '/client/claims', label: 'Мої заявки', icon: FiClipboard },
            { to: '/client/contracts', label: 'Мої контракти', icon: FiFileText },
            { to: '/client/equipment', label: 'Моє обладнання', icon: FiTool },
            { to: '/client/deliveries', label: 'Мої доставки', icon: FiTruck },
            { to: '/client/invoices', label: 'Мої рахунки', icon: FiDollarSign },
            { to: '/client/payments', label: 'Мої платежі', icon: FiCreditCard },
            { to: '/profile', label: 'Мій профіль', icon: FiUser },
        );
    }

    // SERVICE ENGINEER
    if (user.role === 'EMPLOYEE' && user.position === 'SERVICE_ENGINEER') {
        menu.push(
            { to: '/employee/claims', label: 'Призначені заявки', icon: FiClipboard },
            { to: '/employee/employees', label: 'Всі працівники', icon: FiUsers },
            { to: '/employee/equipment', label: 'Всі обладнання', icon: FiTool },
            { to: '/employee/parts', label: 'Всі деталі', icon: FiPackage },
            { to: '/employee/deliveries', label: 'Мої доставки', icon: FiTruck },
            { to: '/profile', label: 'Мій профіль', icon: FiUser },
        );
    }

    // MANAGER / ADMIN
    if (user.role === 'ADMIN' || (user.role === 'EMPLOYEE' && user.position === 'MANAGER')) {
        menu.push(
            { to: '/claims', label: 'Всі заявки', icon: FiClipboard },
            { to: '/clients', label: 'Всі клієнти', icon: FiUsers },
            { to: '/contracts', label: 'Всі контракти', icon: FiFileText },
            { to: '/employees', label: 'Всі працівники', icon: FiBriefcase },
            { to: '/equipment', label: 'Всі обладнання', icon: FiTool },
            { to: '/parts', label: 'Всі деталі', icon: FiPackage },
            { to: '/deliveries', label: 'Всі доставки', icon: FiTruck },
            { to: '/invoices', label: 'Всі рахунки', icon: FiDollarSign },
            { to: '/payments', label: 'Всі оплати', icon: FiCreditCard },
            { to: '/profile', label: 'Мій профіль', icon: FiUser },
        );
    }

    return (
        <div className="h-screen bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800">
            {/* Logo + toggle */}
            <div
                className={[
                    'flex items-center h-12 border-b border-slate-800 px-3',
                    collapsed ? 'justify-center' : 'justify-between',
                ].join(' ')}
            >
                {!collapsed && (
                    <div className="font-semibold tracking-wide">
                        MediRepairTrack
                    </div>
                )}

                <button onClick={onToggle} className="p-2 rounded-md hover:bg-slate-800 transition">
                    <FiMenu size={18} />
                </button>

            </div>


            {/* Navigation */}
            <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
                {menu.map(item => {
                    const active = pathname === item.to;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            title={collapsed ? item.label : undefined}
                            className={[
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                'hover:bg-slate-800 hover:text-white',
                                active
                                    ? 'bg-slate-800 text-blue-300'
                                    : 'text-slate-300',
                            ].join(' ')}
                        >
                            <Icon
                                size={18}
                                className={active
                                    ? 'text-blue-400'
                                    : 'text-slate-400 group-hover:text-white'}
                            />

                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { IconType } from 'react-icons';
import { FiFileText, FiUsers, FiTool, FiTruck, FiDollarSign, FiCreditCard, FiPackage, FiClipboard, FiUser, FiMenu, FiBriefcase, FiBookOpen } from 'react-icons/fi';

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
            { to: '/client/deliveries', label: 'Доставки', icon: FiTruck },
            { to: '/client/invoices', label: 'Рахунки', icon: FiDollarSign },
            { to: '/client/payments', label: 'Оплати', icon: FiCreditCard },
            { to: '/profile', label: 'Мій профіль', icon: FiUser },
        );
    }

    // SERVICE ENGINEER
    if (user.role === 'EMPLOYEE' && user.position === 'SERVICE_ENGINEER') {
        menu.push(
            { to: '/employee/claims', label: 'Призначені заявки', icon: FiClipboard },
            { to: '/employee/employees', label: 'Всі працівники', icon: FiUsers },
            { to: '/equipment', label: 'Обладнання', icon: FiTool },
            { to: '/parts', label: 'Запчастини', icon: FiPackage },
            { to: '/directories', label: 'Довідники', icon: FiBookOpen },
            { to: '/deliveries', label: 'Доставки', icon: FiTruck },
            { to: '/profile', label: 'Мій профіль', icon: FiUser },
        );
    }

    // MANAGER / ADMIN
    if (user.role === 'ADMIN' || (user.role === 'EMPLOYEE' && user.position === 'MANAGER')) {
        menu.push(
            { to: '/claims', label: 'Всі заявки', icon: FiClipboard },
            { to: '/clients', label: 'Клієнти', icon: FiUsers },
            { to: '/employees', label: 'Всі працівники', icon: FiBriefcase },
            { to: '/equipment', label: 'Обладнання', icon: FiTool },
            { to: '/parts', label: 'Запчастини', icon: FiPackage },
            { to: '/directories', label: 'Довідники', icon: FiBookOpen },
            { to: '/finance', label: 'Фінанси', icon: FiDollarSign, },
            { to: '/deliveries', label: 'Доставки', icon: FiTruck },
            { to: '/profile', label: 'Мій профіль', icon: FiUser },
        );
    }

    return (
        <div className="h-screen bg-linear-to-b from-brand-strong to-[#082f37] text-white flex flex-col border-r border-white/10">
            {/* Logo + toggle */}
            <div
                className={[
                    'flex items-center h-14 border-b border-white/10 px-3',
                    collapsed ? 'justify-center' : 'justify-between',
                ].join(' ')}
            >
                {!collapsed && (
                    <div className="font-semibold tracking-wide text-white">
                        MediRepairTrack
                    </div>
                )}

                <button onClick={onToggle} className="p-2 rounded-md hover:bg-white/10 transition">
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
                                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                'hover:bg-white/10 hover:text-white',
                                active
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/70',
                            ].join(' ')}
                        >
                            <Icon
                                size={18}
                                className={active
                                    ? 'text-accent'
                                    : 'text-white/50 group-hover:text-white'}
                            />

                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

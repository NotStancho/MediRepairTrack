import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type MenuItem = { to: string; label: string };

export default function Sidebar() {
    const { user } = useAuth();
    const { pathname } = useLocation();

    if (!user) return null;

    const isClient = user.role === 'CLIENT';
    const isEmployee = user.role === 'EMPLOYEE';
    const isEngineer = isEmployee && user.position === 'SERVICE_ENGINEER';
    const isManager = isEmployee && user.position === 'MANAGER';
    const isAdmin = user.role === 'ADMIN';

    const menu: MenuItem[] = [];

    // CLIENT
    if (isClient) {
        menu.push(
            { to: '/client/claims', label: 'Мої заявки' },
            { to: '/client/contracts', label: 'Мої контракти' },
            { to: '/client/equipment', label: 'Моє обладнання' },
            { to: '/client/deliveries', label: 'Мої доставки' },
            { to: '/client/invoices', label: 'Мої рахунки' },
            { to: '/client/payments', label: 'Мої платежі' },
            { to: '/profile', label: 'Мій профіль' },
        );
    }

    // SERVICE ENGINEER
    if (isEngineer) {
        menu.push(
            { to: '/employee/claims', label: 'Призначені заявки' },
            { to: '/employee/employees', label: 'Всі працівники' },
            { to: '/employee/equipment', label: 'Всі обладнання' },
            { to: '/employee/parts', label: 'Всі деталі' },
            { to: '/employee/deliveries', label: 'Мої доставки' },
            { to: '/profile', label: 'Мій профіль' },
        );
    }

    // MANAGER / ADMIN
    if (isManager || isAdmin) {
        menu.push(
            { to: '/claims', label: 'Всі заявки' },
            { to: '/clients', label: 'Всі клієнти' },
            { to: '/contracts', label: 'Всі контракти' },
            { to: '/employees', label: 'Всі працівники' },
            { to: '/equipment', label: 'Всі обладнання' },
            { to: '/parts', label: 'Всі деталі' },
            { to: '/deliveries', label: 'Всі доставки' },
            { to: '/invoices', label: 'Всі рахунки' },
            { to: '/payments', label: 'Всі оплати' },
            { to: '/profile', label: 'Мій профіль' },
        );
    }

    return (
        <aside className="w-64 h-screen bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800">
            {/* Header / Logo */}
            <div className="px-4 py-4 border-b border-slate-800">
                <div className="text-lg font-semibold tracking-wide">
                    MediRepairTrack
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {menu.map((item) => {
                    const active = pathname === item.to;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={[
                                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                'hover:bg-slate-800 hover:text-white',
                                active
                                    ? 'bg-slate-800 text-blue-300'
                                    : 'text-slate-300',
                            ].join(' ')}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

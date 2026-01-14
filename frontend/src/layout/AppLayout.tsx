import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={`
                grid h-screen bg-gray-50
                grid-rows-[3rem_1fr]
                transition-all duration-300
                ${collapsed
                ? 'grid-cols-[4rem_1fr]'
                : 'grid-cols-[14rem_1fr]'
            }
            `}
        >
            {/* Sidebar */}
            <aside className="row-span-2">
                <Sidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed(v => !v)}
                />
            </aside>

            {/* Header */}
            <header className="col-start-2 row-start-1">
                <Header />
            </header>

            {/* Main */}
            <main className="col-start-2 row-start-2 overflow-y-auto overflow-x-hidden min-w-0">
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

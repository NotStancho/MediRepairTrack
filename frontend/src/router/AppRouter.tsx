import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import { RequireAuth } from './RequireAuth';
import AppLayout from '../layout/AppLayout';

import ClaimListPage from "../pages/claims/ClaimListPage";
import ClaimDetailsPage from "../pages/claims/ClaimDetailsPage";
import ComingSoonPage from "../pages/common/ComingSoonPage";

export default function AppRouter() {
    return (
        <Routes>
            {/* Публічний роут */}
            <Route path="/login" element={<LoginPage />} />

            {/* Захищена зона з layout */}
            <Route
                element={
                    <RequireAuth>
                        <AppLayout />
                    </RequireAuth>
                }
            >
                {/* CLIENT */}
                <Route path="/client" element={<Navigate to="/client/claims" replace />}/>
                <Route path="/client/claims" element={<ClaimListPage />} />
                <Route path="/client/claims/:id" element={<ClaimDetailsPage />} />

                <Route path="/client/contracts" element={<ComingSoonPage title="Мої контракти" />} />
                <Route path="/client/equipment" element={<ComingSoonPage title="Моє обладнання" />} />
                <Route path="/client/deliveries" element={<ComingSoonPage title="Мої доставки" />} />
                <Route path="/client/invoices" element={<ComingSoonPage title="Мої рахунки" />} />
                <Route path="/client/payments" element={<ComingSoonPage title="Мої платежі" />} />

                {/* EMPLOYEE (ENGINEER) */}
                <Route path="/employee/claims" element={<ClaimListPage />} />
                <Route path="/employee/claims/:id" element={<ClaimDetailsPage />} />

                <Route path="/employee/employees" element={<ComingSoonPage title="Всі працівники" />} />
                <Route path="/employee/equipment" element={<ComingSoonPage title="Всі обладнання" />} />
                <Route path="/employee/parts" element={<ComingSoonPage title="Всі деталі" />} />
                <Route path="/employee/deliveries" element={<ComingSoonPage title="Мої доставки" />} />

                {/* ADMIN / MANAGER */}
                <Route path="/claims" element={<ClaimListPage />} />
                <Route path="/claims/:id" element={<ClaimDetailsPage />} />

                <Route path="/clients" element={<ComingSoonPage title="Всі клієнти" />} />
                <Route path="/contracts" element={<ComingSoonPage title="Всі контракти" />} />
                <Route path="/employees" element={<ComingSoonPage title="Всі працівники" />} />
                <Route path="/equipment" element={<ComingSoonPage title="Всі обладнання" />} />
                <Route path="/parts" element={<ComingSoonPage title="Всі деталі" />} />
                <Route path="/deliveries" element={<ComingSoonPage title="Всі доставки" />} />
                <Route path="/invoices" element={<ComingSoonPage title="Всі рахунки" />} />
                <Route path="/payments" element={<ComingSoonPage title="Всі оплати" />} />

                <Route path="/profile" element={<ComingSoonPage title="Мій профіль" />} />
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

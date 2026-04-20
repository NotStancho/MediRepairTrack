import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import { RequireAuth } from './RequireAuth';
import AppLayout from '../layout/AppLayout';

import ClaimListPage from "../pages/claims/ClaimListPage";
import ClaimDetailsPage from "../pages/claims/ClaimDetailsPage";
import ClaimCreatePage from "../pages/claims/ClaimCreatePage";
import ClaimCreateEmployeePage from "../pages/claims/ClaimCreateEmployeePage";

import ClientContractsPage from "../pages/client/ClientContractsPage";
import ClientInvoicesPage from "../pages/client/ClientInvoicesPage";
import ClientPaymentsPage from "../pages/client/ClientPaymentsPage";
import ClientManagementPage from "../pages/clients/ClientManagementPage";
import EquipmentPage from "../pages/equipment/EquipmentPage";
import FinancePage from "../pages/finance/FinancePage";
import PartPage from "../pages/part/PartPage";
import DirectoriesPage from "../pages/directories/DirectoriesPage";

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
                <Route path="/client/claims/new" element={<ClaimCreatePage />} />
                <Route path="/client/claims/:id" element={<ClaimDetailsPage />} />

                <Route path="/client/contracts" element={<ClientContractsPage />} />
                <Route path="/client/equipment" element={<ComingSoonPage title="Моє обладнання" />} />
                <Route path="/client/deliveries" element={<ComingSoonPage title="Мої доставки" />} />
                <Route path="/client/invoices" element={<ClientInvoicesPage />} />
                <Route path="/client/payments" element={<ClientPaymentsPage />} />

                {/* SHARED: EMPLOYEE / ADMIN */}
                <Route path="/employee/claims/new" element={<ClaimCreateEmployeePage />} />
                <Route path="/clients" element={<ClientManagementPage />} />
                <Route path="/equipment" element={<EquipmentPage />} />
                <Route path="/parts" element={<PartPage />} />
                <Route path="/directories" element={<DirectoriesPage />} />

                {/* EMPLOYEE (ENGINEER) */}
                <Route path="/employee/claims" element={<ClaimListPage />} />
                <Route path="/employee/claims/:id" element={<ClaimDetailsPage />} />

                <Route path="/employee/employees" element={<ComingSoonPage title="Всі працівники" />} />
                <Route path="/employee/deliveries" element={<ComingSoonPage title="Мої доставки" />} />

                {/* ADMIN / MANAGER */}
                <Route path="/claims" element={<ClaimListPage />} />
                <Route path="/claims/:id" element={<ClaimDetailsPage />} />
                <Route path="/contracts" element={<ClientManagementPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/employees" element={<ComingSoonPage title="Всі працівники" />} />
                <Route path="/deliveries" element={<ComingSoonPage title="Всі доставки" />} />

                <Route path="/profile" element={<ComingSoonPage title="Мій профіль" />} />
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

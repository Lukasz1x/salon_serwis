import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import HomePage from '@/pages/HomePage';
import UsersPage from '@/pages/admin/UsersPage';

//TODO odkomentowac gdy stworzy sie te strony i zaimportowac lazy z 'react'
// const LocationsPage         = lazy(() => import('@/pages/admin/LocationsPage'));
// const ReportsPage            = lazy(() => import('@/pages/admin/ReportsPage'));
// const SalonAppointmentsPage = lazy(() => import('@/pages/salesrep/SalonAppointmentsPage'));
// const SalesOrdersPage       = lazy(() => import('@/pages/salesrep/SalesOrdersPage'));
// const ServiceAppointmentsPage = lazy(() => import('@/pages/mechanic/ServiceAppointmentsPage'));
// const ClientSalonPage       = lazy(() => import('@/pages/client/SalonAppointmentPage'));
// const ClientServicePage     = lazy(() => import('@/pages/client/ServiceAppointmentPage'));
// const ClientOfferPage       = lazy(() => import('@/pages/client/OfferPage'));
// const ClientLocationsPage   = lazy(() => import('@/pages/client/LocationsPage'));

const VehiclesPage = lazy(() => import('@/pages/salesrep/VehiclesPage'));

export default function AppRouter() {
    return (
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Ładowanie…</div>}>
            <Routes>
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<AppLayout />}>
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SALES_REP', 'MECHANIC', 'CLIENT']} />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>

                    {/* Admin */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin/users"     element={<UsersPage />} />
                        {/* <Route path="/admin/locations" element={<LocationsPage />} /> */}
                        {/*<Route path="/admin/reports"   element={<ReportsPage />} />*/}
                    </Route>

                    {/* Sprzedawca */}
                    {<Route element={<ProtectedRoute allowedRoles={['SALES_REP']} />}>
                        <Route path="/sales/vehicles"     element={<VehiclesPage />} />
                        {/* <Route path="/sales/appointments" element={<SalonAppointmentsPage />} /> */}
                        {/* <Route path="/sales/orders"       element={<SalesOrdersPage />} /> */}
                    </Route>}

                    {/* Mechanik */}
                    {/* <Route element={<ProtectedRoute allowedRoles={['MECHANIC']} />}>
                        <Route path="/service/appointments" element={<ServiceAppointmentsPage />} />
                    </Route> */}

                    {/* Klient */}
                    {/* <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
                        <Route path="/client/salon"     element={<ClientSalonPage />} />
                        <Route path="/client/service"   element={<ClientServicePage />} />
                        <Route path="/client/offer"     element={<ClientOfferPage />} />
                        <Route path="/client/locations" element={<ClientLocationsPage />} />
                    </Route> */}

                    <Route path="/unauthorized" element={
                        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
                            Brak dostępu do tej strony.
                        </div>
                    } />
                </Route>

                <Route path="/"  element={<Navigate to="/home" replace />} />
                <Route path="*"  element={<Navigate to="/login" replace />} />
            </Routes>
        </Suspense>
    );
}
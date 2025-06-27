import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));
const ViewBusRoutes = Loadable(lazy(() => import('component/BusRoutes/ViewBusRoutes')));
const ViewStaff = Loadable(lazy(() => import('component/Staff/ViewStaff'))); // Thêm dòng này
const ViewRoutes = Loadable(lazy(() => import('component/Routes/ViewRoutes'))); // Thêm dòng này
const ViewStations = Loadable(lazy(() => import('component/Stations/ViewStations'))); // Thêm dòng này
const Feedback = Loadable(lazy(() => import('component/Feedback/Feedback')));
const ViewTicket = Loadable(lazy(() => import('component/Ticket/ViewTicket')));
const TransactionHistory = Loadable(lazy(() => import('component/TransactionHistory/TransactionHistory')));
const CreatePromotion = Loadable(lazy(() => import('component/Promotion/CreatePromotion')));
const StudentRequest = Loadable(lazy(() => import('component/StudentRequest/ViewStudentRequest')));

// const CreateStudentRequest = Loadable(lazy(() => import('component/StudentRequest/CreateStudentRequest')));
const DetailStudentRequest = Loadable(lazy(() => import('component/StudentRequest/DetailStudentRequest')));

const CreateStaff = Loadable(lazy(() => import('component/Staff/CreateStaff')));
const DeleteStaff = Loadable(lazy(() => import('component/Staff/DeleteStaff')));
const UpdateStaff = Loadable(lazy(() => import('component/Staff/UpdateStaff')));

const CreateStation = Loadable(lazy(() => import('component/Stations/CreateStation')));
const DeleteStation = Loadable(lazy(() => import('component/Stations/DeleteStation')));
const UpdateStation = Loadable(lazy(() => import('component/Stations/UpdateStation')));

const CreateRoute = Loadable(lazy(() => import('component/Routes/CreateRoute')));
const DeleteRoute = Loadable(lazy(() => import('component/Routes/DeleteRoute')));
const UpdateRoute = Loadable(lazy(() => import('component/Routes/UpdateRoute')));
const DetailRoute = Loadable(lazy(() => import('component/Routes/DetailRoute')));

const CreateTicket = Loadable(lazy(() => import('component/Ticket/CreateTicket')));
const DeleteTicket = Loadable(lazy(() => import('component/Ticket/DeleteTicket')));
const UpdateTicket = Loadable(lazy(() => import('component/Ticket/UpdateTicket')));

const CreateBusRoute = Loadable(lazy(() => import('component/BusRoutes/CreateBusRoute')));
const DeleteBusRoute = Loadable(lazy(() => import('component/BusRoutes/DeleteBusRoute')));
const UpdateBusRoute = Loadable(lazy(() => import('component/BusRoutes/UpdateBusRoute')));


// Auth wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('ProtectedRoute - Token found:', !!token, 'Token value:', token);
    return !!token;
  };

  const authenticated = isAuthenticated();
  console.log('ProtectedRoute - Is authenticated:', authenticated);
  
  if (!authenticated) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/application/login" replace />;
  }
  
  console.log('ProtectedRoute - Rendering protected content');
  return children;
};

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { path: '/', element: <DashboardDefault /> },
    { path: '/dashboard/default', element: <DashboardDefault />},
    { path: '/utils/util-typography', element: <UtilsTypography /> },
    { path: '/sample-page', element: <SamplePage /> },
    { path: '/bus-routes', element: <ProtectedRoute><ViewBusRoutes /></ProtectedRoute> },
    { path: '/staff', element: <ProtectedRoute><ViewStaff /></ProtectedRoute> },
    { path: '/metro-routes', element: <ProtectedRoute><ViewRoutes /></ProtectedRoute> },
    { path: '/stations', element: <ProtectedRoute><ViewStations /></ProtectedRoute> },
    { path: '/feedback', element: <ProtectedRoute><Feedback /></ProtectedRoute> },
    { path: '/ticket', element: <ProtectedRoute><ViewTicket /></ProtectedRoute> },
    { path: '/transaction-history', element: <ProtectedRoute><TransactionHistory /></ProtectedRoute> },
    { path: '/promotion/create', element: <ProtectedRoute><CreatePromotion /></ProtectedRoute> },
    { path: '/student-request', element: <ProtectedRoute><StudentRequest /></ProtectedRoute> },

    { path: '/stations/create', element: <ProtectedRoute><CreateStation /></ProtectedRoute> },
    { path: '/stations/delete', element: <ProtectedRoute><DeleteStation /></ProtectedRoute> },
    { path: '/stations/update', element: <ProtectedRoute><UpdateStation /></ProtectedRoute> },

    { path: '/metro-routes/create', element: <ProtectedRoute><CreateRoute /></ProtectedRoute> },
    { path: '/metro-routes/delete', element: <ProtectedRoute><DeleteRoute /></ProtectedRoute> },
    { path: '/metro-routes/update', element: <ProtectedRoute><UpdateRoute /></ProtectedRoute> },
    { path: '/metro-routes/:id', element: <ProtectedRoute><DetailRoute /></ProtectedRoute> },

    { path: '/ticket/create', element: <ProtectedRoute><CreateTicket /></ProtectedRoute> },
    { path: '/ticket/delete', element: <ProtectedRoute><DeleteTicket /></ProtectedRoute> },
    { path: '/ticket/update', element: <ProtectedRoute><UpdateTicket /></ProtectedRoute> },

    { path: '/staff/create', element: <ProtectedRoute><CreateStaff /></ProtectedRoute> },
    { path: '/staff/delete', element: <ProtectedRoute><DeleteStaff /></ProtectedRoute> },
    { path: '/staff/update', element: <ProtectedRoute><UpdateStaff /></ProtectedRoute> },

    // Thêm các route mới cho bus routes
    { path: '/bus-routes/create', element: <ProtectedRoute><CreateBusRoute /></ProtectedRoute> },
    { path: '/bus-routes/delete', element: <ProtectedRoute><DeleteBusRoute /></ProtectedRoute> },
    { path: '/bus-routes/update/:id', element: <ProtectedRoute><UpdateBusRoute /></ProtectedRoute> },

    // Thêm các route mới cho student request
    // { path: '/student-request/create', element: <CreateStudentRequest /> },
    { path: '/student-request/:id', element: <ProtectedRoute><DetailStudentRequest /></ProtectedRoute> }
  ]
};

export default MainRoutes;
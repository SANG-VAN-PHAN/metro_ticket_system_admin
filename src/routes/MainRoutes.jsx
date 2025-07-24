import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import IntroPage from 'component/IntroPage';
import FeedbackTypeList from 'component/Feedback/FeedbackTypeList';
import FeedbackTypeCreate from 'component/Feedback/FeedbackTypeCreate';
import FeedbackTypeUpdate from 'component/Feedback/FeedbackTypeUpdate';
import FeedbackList from 'component/Feedback/FeedbackList';

const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));
const ViewBusRoutes = Loadable(lazy(() => import('component/BusRoutes/ViewBusRoutes')));
const ViewStaff = Loadable(lazy(() => import('component/Staff/ViewStaff')));
const ViewRoutes = Loadable(lazy(() => import('component/Routes/ViewRoutes')));
const ViewStations = Loadable(lazy(() => import('component/Stations/ViewStations')));
const Feedback = Loadable(lazy(() => import('component/Feedback/Feedback')));
const ViewTicket = Loadable(lazy(() => import('component/Ticket/ViewTicket')));
const TransactionHistory = Loadable(lazy(() => import('component/TransactionHistory/TransactionHistory')));
const CreatePromotion = Loadable(lazy(() => import('component/Promotion/CreatePromotion')));
const StudentRequest = Loadable(lazy(() => import('component/StudentRequest/ViewStudentRequest')));
const DetailStudentRequest = Loadable(lazy(() => import('component/StudentRequest/DetailStudentRequest')));
const ViewCustomers = Loadable(lazy(() => import('component/Customers/ViewCustomers')));
const ViewPriceRanges = Loadable(lazy(() => import('component/PriceRanges/ViewPriceRanges')));

const CreateStaff = Loadable(lazy(() => import('component/Staff/CreateStaff')));
const DeleteStaff = Loadable(lazy(() => import('component/Staff/DeleteStaff')));
const UpdateStaff = Loadable(lazy(() => import('component/Staff/UpdateStaff')));
const DetailStaff = Loadable(lazy(() => import('component/Staff/DetailStaff')));

const CreateStation = Loadable(lazy(() => import('component/Stations/CreateStation')));
const DeleteStation = Loadable(lazy(() => import('component/Stations/DeleteStation')));
const UpdateStation = Loadable(lazy(() => import('component/Stations/UpdateStation')));
const DetailStation = Loadable(lazy(() => import('component/Stations/DetailStation')));

const CreateRoute = Loadable(lazy(() => import('component/Routes/CreateRoute')));
const DeleteRoute = Loadable(lazy(() => import('component/Routes/DeleteRoute')));
const UpdateRoute = Loadable(lazy(() => import('component/Routes/UpdateRoute')));
const DetailRoute = Loadable(lazy(() => import('component/Routes/DetailRoute')));

const CreateTicket = Loadable(lazy(() => import('component/Ticket/CreateTicket')));
const DeleteTicket = Loadable(lazy(() => import('component/Ticket/DeleteTicket')));
const UpdateTicket = Loadable(lazy(() => import('component/Ticket/UpdateTicket')));
const DetailTicket = Loadable(lazy(() => import('component/Ticket/DetailTicket')));

const CreateBusRoute = Loadable(lazy(() => import('component/BusRoutes/CreateBusRoute')));
const DeleteBusRoute = Loadable(lazy(() => import('component/BusRoutes/DeleteBusRoute')));
const UpdateBusRoute = Loadable(lazy(() => import('component/BusRoutes/UpdateBusRoute')));

const CreatePriceRange = Loadable(lazy(() => import('component/PriceRanges/CreatePriceRange')));
const UpdatePriceRange = Loadable(lazy(() => import('component/PriceRanges/UpdatePriceRange')));
const DeletePriceRange = Loadable(lazy(() => import('component/PriceRanges/DeletePriceRange')));

// Role-based Auth wrapper component
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  };

  const getUserRole = () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return null;
      
      const decoded = jwtDecode(token);
      return decoded.roles || localStorage.getItem('role');
    } catch (error) {
      return localStorage.getItem('role');
    }
  };

  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  console.log('RoleBasedRoute - Is authenticated:', authenticated);
  console.log('RoleBasedRoute - User role:', userRole);
  console.log('RoleBasedRoute - Allowed roles:', allowedRoles);

  if (!authenticated) {
    console.log('RoleBasedRoute - Redirecting to login (not authenticated)');
    return <Navigate to="/application/login" replace />;
  }

  // Nếu allowedRoles rỗng, cho phép tất cả user đã đăng nhập truy cập
  if (allowedRoles.length === 0) {
    console.log('RoleBasedRoute - Access granted (no role restriction)');
    return children;
  }

  // Kiểm tra role cụ thể
  if (!allowedRoles.includes(userRole)) {
    console.log('RoleBasedRoute - Access denied for role:', userRole);
    return <Navigate to="/dashboard/default" replace />;
  }

  console.log('RoleBasedRoute - Access granted for role:', userRole);
  return children;
};

// Simple auth wrapper for routes accessible by all authenticated users
const ProtectedRoute = ({ children }) => {
  return <RoleBasedRoute allowedRoles={[]}>{children}</RoleBasedRoute>;
};

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // Public routes (accessible without login)
    { path: '/', element: <ProtectedRoute><IntroPage /></ProtectedRoute> },

    // Routes accessible by all authenticated users
    { path: '/utils/util-typography', element: <ProtectedRoute><UtilsTypography /></ProtectedRoute> },
    { path: '/sample-page', element: <ProtectedRoute><SamplePage /></ProtectedRoute> },

    // Staff-only routes (chỉ Staff được truy cập)
    { 
      path: '/student-request', 
      element: <RoleBasedRoute allowedRoles={['Staff']}><StudentRequest /></RoleBasedRoute> 
    },
    { 
      path: '/student-request/:id', 
      element: <RoleBasedRoute allowedRoles={['Staff']}><DetailStudentRequest /></RoleBasedRoute> 
    },

    // Administrator-only routes (chỉ Administrator được truy cập)
    { path: '/bus-routes', element: <RoleBasedRoute allowedRoles={['Administrator']}><ViewBusRoutes /></RoleBasedRoute> },
    { path: '/staff', element: <RoleBasedRoute allowedRoles={['Administrator']}><ViewStaff /></RoleBasedRoute> },
    { path: '/metro-routes', element: <RoleBasedRoute allowedRoles={['Administrator']}><ViewRoutes /></RoleBasedRoute> },
    { path: '/stations', element: <RoleBasedRoute allowedRoles={['Administrator']}><ViewStations /></RoleBasedRoute> },
    { path: '/feedback', element: <RoleBasedRoute allowedRoles={['Administrator']}><Feedback /></RoleBasedRoute> },
    { path: '/ticket', element: <RoleBasedRoute allowedRoles={['Administrator']}><ViewTicket /></RoleBasedRoute> },
    { path: '/transaction-history', element: <RoleBasedRoute allowedRoles={['Administrator']}><TransactionHistory /></RoleBasedRoute> },
    { path: '/promotion/create', element: <RoleBasedRoute allowedRoles={['Administrator']}><CreatePromotion /></RoleBasedRoute> },
    { path: '/customers', element: <RoleBasedRoute allowedRoles={['Administrator']}><ViewCustomers /></RoleBasedRoute> },
    { path: '/feedback-types', element: <RoleBasedRoute allowedRoles={['Administrator']}><FeedbackTypeList /></RoleBasedRoute> },
    { path: '/feedback-types/create', element: <RoleBasedRoute allowedRoles={['Administrator']}><FeedbackTypeCreate /></RoleBasedRoute> },
    { path: '/feedback-types/update/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><FeedbackTypeUpdate /></RoleBasedRoute> },
    { path: '/admin-feedbacks', element: <RoleBasedRoute allowedRoles={['Administrator']}><FeedbackList /></RoleBasedRoute> },
    {
      path: '/price-ranges',
      element: <RoleBasedRoute allowedRoles={['Administrator']}><ViewPriceRanges /></RoleBasedRoute>
    },
    {
      path: '/price-ranges/create',
      element: <RoleBasedRoute allowedRoles={['Administrator']}><CreatePriceRange /></RoleBasedRoute>
    },
    {
      path: '/price-ranges/update/:id',
      element: <RoleBasedRoute allowedRoles={['Administrator']}><UpdatePriceRange /></RoleBasedRoute>
    },
    {
      path: '/price-ranges/delete/:id',
      element: <RoleBasedRoute allowedRoles={['Administrator']}><DeletePriceRange /></RoleBasedRoute>
    },
    // TODO: sẽ thêm các route create, update, delete bên dưới

    // Station management routes - Administrator only
    { path: '/stations/create', element: <RoleBasedRoute allowedRoles={['Administrator']}><CreateStation /></RoleBasedRoute> },
    { path: '/stations/delete/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><DeleteStation /></RoleBasedRoute> },
    { path: '/stations/update/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><UpdateStation /></RoleBasedRoute> },
    { path: '/stations/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><DetailStation /></RoleBasedRoute> },

    // Metro routes management - Administrator only
    { path: '/metro-routes/create', element: <RoleBasedRoute allowedRoles={['Administrator']}><CreateRoute /></RoleBasedRoute> },
    { path: '/metro-routes/delete', element: <RoleBasedRoute allowedRoles={['Administrator']}><DeleteRoute /></RoleBasedRoute> },
    { path: '/metro-routes/update/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><UpdateRoute /></RoleBasedRoute> },
    { path: '/metro-routes/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><DetailRoute /></RoleBasedRoute> },

    // Ticket management routes - Administrator only
    { path: '/ticket/create', element: <RoleBasedRoute allowedRoles={['Administrator']}><CreateTicket /></RoleBasedRoute> },
    { path: '/ticket/delete', element: <RoleBasedRoute allowedRoles={['Administrator']}><DeleteTicket /></RoleBasedRoute> },
    { path: '/ticket/update/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><UpdateTicket /></RoleBasedRoute> },
    { path: '/ticket/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><DetailTicket /></RoleBasedRoute> },

    // Staff management routes - Administrator only
    { path: '/staff/create', element: <RoleBasedRoute allowedRoles={['Administrator']}><CreateStaff /></RoleBasedRoute> },
    { path: '/staff/delete', element: <RoleBasedRoute allowedRoles={['Administrator']}><DeleteStaff /></RoleBasedRoute> },
    { path: '/staff/update/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><UpdateStaff /></RoleBasedRoute> },
    { path: '/staff/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><DetailStaff /></RoleBasedRoute> },

    // Bus routes management - Administrator only
    { path: '/bus-routes/create', element: <RoleBasedRoute allowedRoles={['Administrator']}><CreateBusRoute /></RoleBasedRoute> },
    { path: '/bus-routes/delete', element: <RoleBasedRoute allowedRoles={['Administrator']}><DeleteBusRoute /></RoleBasedRoute> },
    { path: '/bus-routes/update/:id', element: <RoleBasedRoute allowedRoles={['Administrator']}><UpdateBusRoute /></RoleBasedRoute> }
  ]
};

export default MainRoutes;
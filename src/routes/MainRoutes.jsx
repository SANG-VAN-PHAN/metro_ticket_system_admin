import React, { lazy } from 'react';

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


// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { path: '/', element: <DashboardDefault /> },
    { path: '/dashboard/default', element: <DashboardDefault />},
    { path: '/utils/util-typography', element: <UtilsTypography /> },
    { path: '/sample-page', element: <SamplePage /> },
    { path: '/bus-routes', element: <ViewBusRoutes /> },
    { path: '/staff', element: <ViewStaff /> },
    { path: '/metro-routes', element: <ViewRoutes /> },
    { path: '/stations', element: <ViewStations /> },
    { path: '/feedback', element: <Feedback /> },
    { path: '/ticket', element: <ViewTicket /> },
    { path: '/transaction-history', element: <TransactionHistory /> },
    { path: '/promotion/create', element: <CreatePromotion /> },
    { path: '/student-request', element: <StudentRequest /> },

    { path: '/stations/create', element: <CreateStation /> },
    { path: '/stations/delete', element: <DeleteStation /> },
    { path: '/stations/update', element: <UpdateStation /> },

    { path: '/metro-routes/create', element: <CreateRoute /> },
    { path: '/metro-routes/delete', element: <DeleteRoute /> },
    { path: '/metro-routes/update', element: <UpdateRoute /> },
    { path: '/metro-routes/:id', element: <DetailRoute /> },

    { path: '/ticket/create', element: <CreateTicket /> },
    { path: '/ticket/delete', element: <DeleteTicket /> },
    { path: '/ticket/update', element: <UpdateTicket /> },

    { path: '/staff/create', element: <CreateStaff /> },
    { path: '/staff/delete', element: <DeleteStaff /> },
    { path: '/staff/update', element: <UpdateStaff /> },

    // Thêm các route mới cho bus routes
    { path: '/bus-routes/create', element: <CreateBusRoute /> },
    { path: '/bus-routes/delete', element: <DeleteBusRoute /> },
    { path: '/bus-routes/update/:id', element: <UpdateBusRoute /> },

    // Thêm các route mới cho student request
    // { path: '/student-request/create', element: <CreateStudentRequest /> },
    { path: '/student-request/:id', element: <DetailStudentRequest /> }
  ]
};

export default MainRoutes;
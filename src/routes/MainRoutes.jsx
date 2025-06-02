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

const CreateStation = Loadable(lazy(() => import('component/Stations/CreateStation')));
const DeleteStation = Loadable(lazy(() => import('component/Stations/DeleteStation')));
const UpdateStation = Loadable(lazy(() => import('component/Stations/UpdateStation')));

const CreateRoute = Loadable(lazy(() => import('component/Routes/CreateRoute')));
const DeleteRoute = Loadable(lazy(() => import('component/Routes/DeleteRoute')));
const UpdateRoute = Loadable(lazy(() => import('component/Routes/UpdateRoute')));

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

    { path: '/stations/create', element: <CreateStation /> },
    { path: '/stations/delete', element: <DeleteStation /> },
    { path: '/stations/update', element: <UpdateStation /> },

    { path: '/metro-routes/create', element: <CreateRoute /> },
    { path: '/metro-routes/delete', element: <DeleteRoute /> },
    { path: '/metro-routes/update', element: <UpdateRoute /> },

  ]
};

export default MainRoutes;
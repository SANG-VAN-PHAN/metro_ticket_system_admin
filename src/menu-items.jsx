// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //

// eslint-disable-next-line

let role = '';
try {
  role = localStorage.getItem('role') || '';
} catch {
  role = '';
}

export default {
  items: [
    // {
    //   id: 'navigation',
    //   title: 'Metro HCM',
    //   caption: 'Dashboard',
    //   type: 'group',
    //   icon: icons['NavigationOutlinedIcon'],
    //   children: [
    //     {
    //       id: 'dashboard',
    //       title: 'Dashboard',
    //       type: 'item',
    //       icon: icons['HomeOutlinedIcon'],
    //       url: '/dashboard/default'
    //     }
    //   ]
    // },
    {
      id: 'pages',
      title: 'Pages',
      caption: 'Metro Pages',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        ...(role === 'Administrator'
          ? [
        {
          id: 'metro-routes',
          title: 'QUẢN LÝ TUYẾN',
          type: 'item',
          url: '/metro-routes',
          icon: icons['ChromeReaderModeOutlinedIcon']
        },
        {
          id: 'staff',
          title: 'QUẢN LÝ NHÂN VIÊN',
          type: 'item',
          url: '/staff',
          icon: icons['AccountTreeOutlinedIcon']
        },
        {
    id: 'stations',
    title: 'QUẢN LÝ GA',
    type: 'item',
    url: '/stations',
    icon: icons['AppsOutlinedIcon']
  },
   {
    id: 'ticket',
    title: 'QUẢN LÝ CÁC LOẠI VÉ',
    type: 'item',
    url: '/ticket',
    icon: icons['ChromeReaderModeOutlinedIcon']
  },
  {
    id: 'price-ranges',
    title: 'QUẢN LÝ GIÁ VÉ',
    type: 'item',
    url: '/price-ranges',
    icon: icons['ChromeReaderModeOutlinedIcon']
  },
//   {
//   id: 'transaction-history',
//   title: 'Transaction History',
//   type: 'item',
//   url: '/transaction-history',
//   icon: icons['ChromeReaderModeOutlinedIcon']
// },
// {
//   id: 'promotion',
//   title: 'Promotion',
//   type: 'item',
//   url: '/promotion/create',
//   icon: icons['ChromeReaderModeOutlinedIcon']
// },
{
  id: 'bus-routes',
  title: 'QUẢN LÝ TUYẾN XE BUÝT',
  type: 'item',
  url: '/bus-routes',
  icon: icons['ChromeReaderModeOutlinedIcon']
},
{
      id: 'customers',
      title: 'QUẢN LÝ KHÁCH HÀNG',
      type: 'item',
      url: '/customers',
      icon: icons['AccountTreeOutlinedIcon']
    },
    {
      id: 'feedback-types',
      title: 'QUẢN LÝ LOẠI ĐÁNH GIÁ',
      type: 'item',
      url: '/feedback-types',
      icon: icons['ContactSupportOutlinedIcon']
    },
    {
      id: 'admin-feedbacks',
      title: 'QUẢN LÝ ĐÁNH GIÁ',
      type: 'item',
      url: '/admin-feedbacks',
      icon: icons['ContactSupportOutlinedIcon']
    },
 ]
          : []),


...(role === 'Staff'
          ? [
              {
                id: 'student-request',
                title: 'XÁC NHẬN HỌC SINH SINH VIÊN',
                type: 'item',
                url: '/student-request',
                icon: icons['ChromeReaderModeOutlinedIcon'],
              }
            ]
          : []),
        ...(!role
      ? [
          {
            id: 'auth',
            title: 'Authentication',
            type: 'collapse',
            icon: icons['SecurityOutlinedIcon'],
            children: [
              {
                id: 'login-1',
                title: 'Login',
                type: 'item',
                url: '/application/login',
              },
              {
                id: 'register',
                title: 'Register',
                type: 'item',
                url: '/application/register',
              }
            ]
          }
        ]
      : [])
  ]
},
  ]
};

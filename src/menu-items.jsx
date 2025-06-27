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
    {
      id: 'navigation',
      title: 'Metro HCM',
      caption: 'Dashboard',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      caption: 'Metro Pages',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [

        // Menu cho Administrator - hiện tất cả trừ Student Request
        ...(role === 'Administrator'
          ? [
        {
          id: 'metro-routes',
          title: 'Routes',
          type: 'item',
          url: '/metro-routes',
          icon: icons['ChromeReaderModeOutlinedIcon']
        },
        {
          id: 'staff',
          title: 'Staff',
          type: 'item',
          url: '/staff',
          icon: icons['AccountTreeOutlinedIcon']
        },
        {
    id: 'stations',
    title: 'Stations',
    type: 'item',
    url: '/stations',
    icon: icons['AppsOutlinedIcon']
  },
   {
    id: 'ticket',
    title: 'Ticket',
    type: 'item',
    url: '/ticket',
    icon: icons['ChromeReaderModeOutlinedIcon']
  },
  {
  id: 'transaction-history',
  title: 'Transaction History',
  type: 'item',
  url: '/transaction-history',
  icon: icons['ChromeReaderModeOutlinedIcon']
},
{
  id: 'promotion',
  title: 'Promotion',
  type: 'item',
  url: '/promotion/create',
  icon: icons['ChromeReaderModeOutlinedIcon']
},
{
  id: 'bus-routes',
  title: 'Bus Routes',
  type: 'item',
  url: '/bus-routes',
  icon: icons['ChromeReaderModeOutlinedIcon']
}
 ]
          : []),

          
...(role === 'Staff'
          ? [
              {
                id: 'student-request',
                title: 'Student Request',
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
    {
      id: 'utils',
      title: 'Utils',
      type: 'group',
      icon: icons['AccountTreeOutlinedIcon'],
      children: [
        // {
        //   id: 'util-icons',
        //   title: 'Icons',
        //   type: 'item',
        //   url: 'https://mui.com/material-ui/material-icons/',
        //   icon: icons['AppsOutlinedIcon'],
        //   external: true,
        //   target: true
        // },
        // {
        //   id: 'util-typography',
        //   title: 'Typography',
        //   type: 'item',
        //   url: '/utils/util-typography',
        //   icon: icons['FormatColorTextOutlinedIcon']
        // }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: icons['ContactSupportOutlinedIcon'],
      children: [
        // {
        //   id: 'disabled-menu',
        //   title: 'Disabled Menu',
        //   type: 'item',
        //   url: '#',
        //   icon: icons['BlockOutlinedIcon'],
        //   disabled: true
        // },
        // {
        //   id: 'documentation',
        //   title: 'Documentation',
        //   type: 'item',
        //   url: 'https://codedthemes.gitbook.io/materially-react-material-documentation/',
        //   icon: icons['HelpOutlineOutlinedIcon'],
        //   external: true,
        //   target: true
        // }
      ]
    }
  ]
};

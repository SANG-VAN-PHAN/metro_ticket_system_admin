import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Fade, Button, ClickAwayListener, Paper, Popper, List, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';

// assets
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import DraftsTwoToneIcon from '@mui/icons-material/DraftsTwoTone';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';

// ==============================|| PROFILE SECTION ||============================== //

const ProfileSection = () => {

  const isLoggedIn = Boolean(localStorage.getItem('user'));
  if (!isLoggedIn) return null;
  
  const theme = useTheme();
  const navigate = useNavigate(); 

   const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setOpen(false);
    navigate('/');
    window.location.reload();
  };

  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  // Lấy tên user từ localStorage
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userObj = JSON.parse(user);
      if (userObj.FirstName && userObj.FirstName.trim() !== '') {
        setUserName(userObj.FirstName);
      } else if (userObj.LastName && userObj.LastName.trim() !== '') {
        setUserName(userObj.LastName);
      } else if (userObj.email) {
        setUserName(userObj.email);
      } else {
        setUserName('');
      }
    } catch {
      setUserName('');
    }
  } else {
    setUserName('');
  }
}, []);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        sx={{ minWidth: { sm: 50, xs: 35 } }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Profile"
        onClick={handleToggle}
        color="inherit"
      >
        <AccountCircleTwoToneIcon sx={{ fontSize: '1.5rem' }} />
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
                    <ListItemIcon>
                      <SettingsTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemIcon>
                      <PersonTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary={userName ? userName : "Profile"} />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                    <ListItemIcon>
                      <DraftsTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Messages" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
                    <ListItemIcon>
                      <LockOpenTwoTone />
                    </ListItemIcon>
                    <ListItemText primary="Lock Screen" />
                  </ListItemButton>
                  <ListItemButton selected={selectedIndex === 4} onClick={handleLogout}>
                    <ListItemIcon>
                      <MeetingRoomTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;

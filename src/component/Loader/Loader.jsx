import React, { useState, useEffect } from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// loader style
const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

// ==============================|| LOADER ||============================== //

// const Loader = () => {
//   return (
//     <LoaderWrapper>
//       <LinearProgress color="secondary" />
//     </LoaderWrapper>
//   );
// };

// const Loader = () => {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setShow(true), 5000); // Loader xuất hiện sau 200ms
//     return () => clearTimeout(timer);
//   }, []);

//   if (!show) return null;

//   return (
//     <LoaderWrapper>
//       <LinearProgress color="secondary" />
//     </LoaderWrapper>
//   );
// };

const Loader = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000); // Loader luôn hiển thị 5 giây
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <LoaderWrapper>
      <LinearProgress color="secondary" />
    </LoaderWrapper>
  );
};

export default Loader;

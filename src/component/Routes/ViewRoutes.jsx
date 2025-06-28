// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
// // //   TableHead, TableRow, Paper, Stack, Button, Autocomplete, TextField, CircularProgress
// // // } from '@mui/material';
// // // import { Link } from 'react-router-dom';
// // // import Avatar from '@mui/material/Avatar';

// // // const ViewRoutes = () => {
// // //   const [metroRoutes, setMetroRoutes] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const [stationOptions, setStationOptions] = useState([]);
// // //   const [stationLoading, setStationLoading] = useState(false);
// // //   const [searchInput, setSearchInput] = useState('');
// // //   const [filteredRoutes, setFilteredRoutes] = useState([]);
// // //   const [selectedStation, setSelectedStation] = useState(null);

// // //   useEffect(() => {
// // //     fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
// // //       method: 'GET',
// // //       headers: { 'Content-Type': 'application/json' }
// // //     })
// // //       .then(res => res.json())
// // //       .then(data => {
// // //         setMetroRoutes(data.data.routes);
// // //         setFilteredRoutes(data.data.routes);
// // //         setLoading(false);
// // //       })
// // //       .catch(() => setLoading(false));
// // //   }, []);

// // //   // Khi nhập vào ô search, chỉ cập nhật dropdown
// // //   const handleStationSearch = async (event, value) => {
// // //     setSearchInput(value || '');

// // //     if (!value) {
// // //       setStationOptions([]);
// // //       return;
// // //     }

// // //     setStationLoading(true);
// // //     try {
// // //       const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?name=${encodeURIComponent(value)}`);
// // //       const data = await res.json();
// // //       setStationOptions(data.data.stations || []);
// // //     } catch {
// // //       setStationOptions([]);
// // //     }
// // //     setStationLoading(false);
// // //   };

// // //   // Khi chọn station hoặc ấn Enter
// // //   const handleStationSelect = (event, value) => {
// // //     setSelectedStation(value);
// // //     if (value && value.id) {
// // //       setFilteredRoutes(
// // //         metroRoutes.filter(route =>
// // //           route.stations && route.stations.some(st => st.id === value.id)
// // //         )
// // //       );
// // //     } else {
// // //       setFilteredRoutes(metroRoutes);
// // //     }
// // //   };

// // //   // Bắt sự kiện Enter trong ô search
// // //   const handleKeyDown = (event) => {
// // //   if (event.key === 'Enter') {
// // //     if (!searchInput) {
// // //       setFilteredRoutes(metroRoutes);
// // //       return;
// // //     }
// // //     setFilteredRoutes(
// // //       metroRoutes.filter(route =>
// // //         route.name.toLowerCase().includes(searchInput.toLowerCase())
// // //       )
// // //     );
// // //   }
// // // };

// // //   if (loading) return <div>Loading...</div>;
// // //   if (!metroRoutes || metroRoutes.length === 0) return <div>Không có dữ liệu tuyến metro.</div>;

// // //   return (
// // //     <Card>
// // //       <Autocomplete
// // //   freeSolo
// // //   options={stationOptions}
// // //   getOptionLabel={(option) =>
// // //     typeof option === 'string'
// // //       ? option
// // //       : `${option.name} (${option.id})`
// // //   }
// // //   isOptionEqualToValue={(option, value) =>
// // //     typeof value === 'string'
// // //       ? false
// // //       : option.id === value.id
// // //   }
// // //   loading={stationLoading}
// // //   inputValue={searchInput}
// // //   onInputChange={handleStationSearch}
// // //   // KHÔNG dùng onChange để lọc khi nhập tự do
// // //   renderInput={(params) => (
// // //     <TextField
// // //       {...params}
// // //       label="Tìm kiếm Station"
// // //       onKeyDown={handleKeyDown}
// // //       InputProps={{
// // //         ...params.InputProps,
// // //         endAdornment: (
// // //           <>
// // //             {stationLoading ? <CircularProgress color="inherit" size={20} /> : null}
// // //             {params.InputProps.endAdornment}
// // //           </>
// // //         ),
// // //       }}
// // //     />
// // //   )}
// // // />
// // //       <CardContent>
// // //         <Typography variant="h4" gutterBottom>
// // //           Danh sách tuyến đường Metro
// // //         </Typography>
// // //         <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
// // //           <Button component={Link} to="/metro-routes/create" variant="contained" color="primary">
// // //             Thêm tuyến mới
// // //           </Button>
// // //           <Button component={Link} to="/metro-routes/delete" variant="outlined" color="error">
// // //             Xóa tuyến
// // //           </Button>
// // //           <Button component={Link} to="/metro-routes/update" variant="outlined" color="secondary">
// // //             Cập nhật tuyến
// // //           </Button>
// // //         </Stack>
// // //         <TableContainer component={Paper}>
// // //           <Table>
// // //             <TableHead>
// // //               <TableRow>
// // //                 <TableCell>Mã tuyến (Code)</TableCell>
// // //                 <TableCell>Tên tuyến (Name)</TableCell>
// // //                 <TableCell>Ảnh đại diện</TableCell>
// // //                 <TableCell>Chiều dài (km)</TableCell>
// // //                 <TableCell></TableCell>
// // //               </TableRow>
// // //             </TableHead>
// // //             <TableBody>
// // //               {filteredRoutes.map((route) => (
// // //                 <TableRow key={route.id}>
// // //                   <TableCell>{route.code}</TableCell>
// // //                   <TableCell>{route.name}</TableCell>
// // //                   <TableCell>
// // //                     {route.thumbnailImageUrl && route.thumbnailImageUrl !== "empty" ? (
// // //                       <Avatar src={route.thumbnailImageUrl} alt={route.name} />
// // //                     ) : (
// // //                       <Avatar src="https://picsum.photos/seed/metro21/100/100" alt="default" />
// // //                     )}
// // //                   </TableCell>
// // //                   <TableCell>{route.lengthInKm}</TableCell>
// // //                   <TableCell>
// // //                     <Button
// // //                       component={Link}
// // //                       to={`/metro-routes/${route.id}`}
// // //                       variant="outlined"
// // //                       size="small"
// // //                     >
// // //                       Xem chi tiết
// // //                     </Button>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// // //         </TableContainer>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // export default ViewRoutes;

// // import React, { useEffect, useState } from 'react';
// // import {
// //   Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
// //   TableHead, TableRow, Paper, Stack, Button, Autocomplete, TextField, CircularProgress, Avatar
// // } from '@mui/material';
// // import { Link } from 'react-router-dom';

// // const ViewRoutes = () => {
// //   const [metroRoutes, setMetroRoutes] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [stationOptions, setStationOptions] = useState([]);
// //   const [stationLoading, setStationLoading] = useState(false);
// //   const [searchInput, setSearchInput] = useState('');
// //   const [filteredRoutes, setFilteredRoutes] = useState([]);
// //   const [selectedStation, setSelectedStation] = useState(null);

// //   // Pagination state
// //   const [page, setPage] = useState(0);
// //   const rowsPerPage = 5;
// //   const totalPages = Math.ceil(filteredRoutes.length / rowsPerPage);
// //   const paginatedRoutes = filteredRoutes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

// //   useEffect(() => {
// //     fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
// //       method: 'GET',
// //       headers: { 'Content-Type': 'application/json' }
// //     })
// //       .then(res => res.json())
// //       .then(data => {
// //         setMetroRoutes(data.data.routes);
// //         setFilteredRoutes(data.data.routes);
// //         setLoading(false);
// //       })
// //       .catch(() => setLoading(false));
// //   }, []);

// //   // Khi nhập vào ô search, chỉ cập nhật dropdown
// //   const handleStationSearch = async (event, value) => {
// //     setSearchInput(value || '');

// //     if (!value) {
// //       setStationOptions([]);
// //       return;
// //     }

// //     setStationLoading(true);
// //     try {
// //       const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?name=${encodeURIComponent(value)}`);
// //       const data = await res.json();
// //       setStationOptions(data.data.stations || []);
// //     } catch {
// //       setStationOptions([]);
// //     }
// //     setStationLoading(false);
// //   };

// //   // Khi chọn station hoặc ấn Enter
// //   const handleStationSelect = (event, value) => {
// //     setSelectedStation(value);
// //     setPage(0); // reset về trang đầu khi lọc
// //     if (value && value.id) {
// //       setFilteredRoutes(
// //         metroRoutes.filter(route =>
// //           route.stations && route.stations.some(st => st.id === value.id)
// //         )
// //       );
// //     } else {
// //       setFilteredRoutes(metroRoutes);
// //     }
// //   };

// //   // Bắt sự kiện Enter trong ô search
// //   const handleKeyDown = (event) => {
// //     if (event.key === 'Enter') {
// //       setPage(0); // reset về trang đầu khi lọc
// //       if (!searchInput) {
// //         setFilteredRoutes(metroRoutes);
// //         return;
// //       }
// //       setFilteredRoutes(
// //         metroRoutes.filter(route =>
// //           route.name.toLowerCase().includes(searchInput.toLowerCase())
// //         )
// //       );
// //     }
// //   };

// //   if (loading) return <div>Loading...</div>;
// //   if (!metroRoutes || metroRoutes.length === 0) return <div>Không có dữ liệu tuyến metro.</div>;

// //   return (
// //     <Card>
// //       <Autocomplete
// //         freeSolo
// //         options={stationOptions}
// //         getOptionLabel={(option) =>
// //           typeof option === 'string'
// //             ? option
// //             : `${option.name} (${option.id})`
// //         }
// //         isOptionEqualToValue={(option, value) =>
// //           typeof value === 'string'
// //             ? false
// //             : option.id === value.id
// //         }
// //         loading={stationLoading}
// //         inputValue={searchInput}
// //         onInputChange={handleStationSearch}
// //         onChange={handleStationSelect}
// //         renderInput={(params) => (
// //           <TextField
// //             {...params}
// //             label="Tìm kiếm Station"
// //             onKeyDown={handleKeyDown}
// //             InputProps={{
// //               ...params.InputProps,
// //               endAdornment: (
// //                 <>
// //                   {stationLoading ? <CircularProgress color="inherit" size={20} /> : null}
// //                   {params.InputProps.endAdornment}
// //                 </>
// //               ),
// //             }}
// //           />
// //         )}
// //       />
// //       <CardContent>
// //         <Typography variant="h4" gutterBottom>
// //           Danh sách tuyến đường Metro
// //         </Typography>
// //         <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
// //           <Button component={Link} to="/metro-routes/create" variant="contained" color="primary">
// //             Thêm tuyến mới
// //           </Button>
// //           <Button component={Link} to="/metro-routes/delete" variant="outlined" color="error">
// //             Xóa tuyến
// //           </Button>
// //           <Button component={Link} to="/metro-routes/update" variant="outlined" color="secondary">
// //             Cập nhật tuyến
// //           </Button>
// //         </Stack>
// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Mã tuyến (Code)</TableCell>
// //                 <TableCell>Tên tuyến (Name)</TableCell>
// //                 <TableCell>Ảnh đại diện</TableCell>
// //                 <TableCell>Chiều dài (km)</TableCell>
// //                 <TableCell></TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {paginatedRoutes.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={5} align="center">Không có dữ liệu</TableCell>
// //                 </TableRow>
// //               ) : (
// //                 paginatedRoutes.map((route) => (
// //                   <TableRow key={route.id}>
// //                     <TableCell>{route.code}</TableCell>
// //                     <TableCell>{route.name}</TableCell>
// //                     <TableCell>
// //                       {route.thumbnailImageUrl && route.thumbnailImageUrl !== "empty" ? (
// //                         <Avatar src={route.thumbnailImageUrl} alt={route.name} />
// //                       ) : (
// //                         <Avatar src="https://picsum.photos/seed/metro21/100/100" alt="default" />
// //                       )}
// //                     </TableCell>
// //                     <TableCell>{route.lengthInKm}</TableCell>
// //                     <TableCell>
// //                       <Button
// //                         component={Link}
// //                         to={`/metro-routes/${route.id}`}
// //                         variant="outlined"
// //                         size="small"
// //                       >
// //                         Xem chi tiết
// //                       </Button>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //         <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2 }}>
// //           <Button
// //             size="small"
// //             disabled={page === 0}
// //             onClick={() => setPage(page - 1)}
// //           >
// //             Trước
// //           </Button>
// //           <Typography>
// //             Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
// //           </Typography>
// //           <Button
// //             size="small"
// //             disabled={page + 1 >= totalPages}
// //             onClick={() => setPage(page + 1)}
// //           >
// //             Sau
// //           </Button>
// //         </Stack>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default ViewRoutes;



// import React, { useEffect, useState } from 'react';
// import {
//   Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Stack, Button, Avatar
// } from '@mui/material';
// import { Link } from 'react-router-dom';

// const ViewRoutes = () => {
//   const [metroRoutes, setMetroRoutes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const rowsPerPage = 5;
//   const totalPages = Math.ceil(metroRoutes.length / rowsPerPage);
//   const paginatedRoutes = metroRoutes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   useEffect(() => {
//     fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setMetroRoutes(data.data.routes);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (!metroRoutes || metroRoutes.length === 0) return <div>Không có dữ liệu tuyến metro.</div>;

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Danh sách tuyến đường Metro
//         </Typography>
//         <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//           <Button component={Link} to="/metro-routes/create" variant="contained" color="primary">
//             Thêm tuyến mới
//           </Button>
//           <Button component={Link} to="/metro-routes/delete" variant="outlined" color="error">
//             Xóa tuyến
//           </Button>
//           <Button component={Link} to="/metro-routes/update" variant="outlined" color="secondary">
//             Cập nhật tuyến
//           </Button>
//         </Stack>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Mã tuyến (Code)</TableCell>
//                 <TableCell>Tên tuyến (Name)</TableCell>
//                 <TableCell>Ảnh đại diện</TableCell>
//                 <TableCell>Chiều dài (km)</TableCell>
//                 <TableCell></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedRoutes.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">Không có dữ liệu</TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedRoutes.map((route) => (
//                   <TableRow key={route.id}>
//                     <TableCell>{route.code}</TableCell>
//                     <TableCell>{route.name}</TableCell>
//                     <TableCell>
//                       {route.thumbnailImageUrl && route.thumbnailImageUrl !== "empty" ? (
//                         <Avatar src={route.thumbnailImageUrl} alt={route.name} />
//                       ) : (
//                         <Avatar src="https://picsum.photos/seed/metro21/100/100" alt="default" />
//                       )}
//                     </TableCell>
//                     <TableCell>{route.lengthInKm}</TableCell>
//                     <TableCell>
//                       <Button
//                         component={Link}
//                         to={`/metro-routes/${route.id}`}
//                         variant="outlined"
//                         size="small"
//                       >
//                         Xem chi tiết
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2 }}>
//           <Button
//             size="small"
//             disabled={page === 0}
//             onClick={() => setPage(page - 1)}
//           >
//             Trước
//           </Button>
//           <Typography>
//             Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
//           </Typography>
//           <Button
//             size="small"
//             disabled={page + 1 >= totalPages}
//             onClick={() => setPage(page + 1)}
//           >
//             Sau
//           </Button>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// };

// export default ViewRoutes;











import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Button, Avatar, CircularProgress, Box
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// ✅ THÊM HÀM FORMAT SỐ THẬP PHÂN
const formatDecimal = (value, decimals = 2) => {
  if (!value || value === '' || value === null || value === undefined) return '0.00';
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
};

const ViewRoutes = () => {
  const navigate = useNavigate();
  const [metroRoutes, setMetroRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(metroRoutes.length / rowsPerPage);
  const paginatedRoutes = metroRoutes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ✅ KIỂM TRA AUTHENTICATION
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      navigate('/application/login');
      return;
    }
    
    if (role !== 'Administrator') {
      navigate('/dashboard/default');
      return;
    }
  }, [navigate]);

  // ✅ CẢI TIẾN FETCH DATA VỚI ERROR HANDLING
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.data || !Array.isArray(data.data.routes)) {
          throw new Error('Dữ liệu không hợp lệ từ server');
        }

        setMetroRoutes(data.data.routes);
        setError('');
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError(err.message || 'Không thể tải dữ liệu tuyến đường');
        setMetroRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // ✅ LOADING STATE VỚI UI ĐẸP
  if (loading) {
    return (
      <Card sx={{ backgroundColor: '#e8f5e8' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Stack spacing={2} alignItems="center">
              <CircularProgress sx={{ color: '#4caf50' }} />
              <Typography>Đang tải danh sách tuyến đường...</Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <Card sx={{ backgroundColor: '#ffebee' }}>
        <CardContent>
          <Typography variant="h5" color="error" gutterBottom>
            Lỗi tải dữ liệu
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            onClick={() => window.location.reload()} 
            variant="contained"
            sx={{ 
              backgroundColor: '#4caf50', 
              '&:hover': { backgroundColor: '#45a049' } 
            }}
          >
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ✅ EMPTY STATE
  if (!metroRoutes || metroRoutes.length === 0) {
    return (
      <Card sx={{ backgroundColor: '#e8f5e8' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
            Danh sách tuyến đường Metro
          </Typography>
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có tuyến đường nào
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Hãy thêm tuyến đường đầu tiên cho hệ thống
            </Typography>
            <Button 
              component={Link} 
              to="/metro-routes/create" 
              variant="contained"
              sx={{ 
                backgroundColor: '#4caf50', 
                '&:hover': { backgroundColor: '#45a049' } 
              }}
            >
              Thêm tuyến mới
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ backgroundColor: '#e8f5e8' }}> {/* ✅ Background xanh lá */}
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
          Danh sách tuyến đường Metro
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2, color: '#388e3c' }}>
          Tổng cộng: <strong>{metroRoutes.length}</strong> tuyến đường
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button 
            component={Link} 
            to="/metro-routes/create" 
            variant="contained"
            sx={{ 
              backgroundColor: '#4caf50', 
              '&:hover': { backgroundColor: '#45a049' } 
            }}
          >
            Thêm tuyến mới
          </Button>
          <Button 
            component={Link} 
            to="/metro-routes/delete" 
            variant="outlined" 
            color="error"
            sx={{
              borderColor: '#f44336',
              color: '#f44336',
              '&:hover': { 
                borderColor: '#d32f2f',
                backgroundColor: '#ffebee'
              }
            }}
          >
            Xóa tuyến
          </Button>
          <Button 
            component={Link} 
            to="/metro-routes/update" 
            variant="outlined"
            sx={{
              borderColor: '#9c27b0',
              color: '#9c27b0',
              '&:hover': { 
                borderColor: '#7b1fa2',
                backgroundColor: '#f3e5f5'
              }
            }}
          >
            Cập nhật tuyến
          </Button>
        </Stack>

        {/* ✅ BỎ THANH CUỘN NGANG - THÊM overflowX: 'hidden' */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: '#f1f8f1', 
            borderRadius: 2,
            overflowX: 'hidden', // ✅ BỎ THANH CUỘN NGANG
            overflowY: 'auto'    // ✅ CHỈ GIỮ CUỘN DỌC NẾU CẦN
          }}
        >
          <Table sx={{ width: '100%', tableLayout: 'fixed' }}> {/* ✅ FIXED LAYOUT */}
            <TableHead>
              <TableRow sx={{ backgroundColor: '#c8e6c9' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32', width: '8%' }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32', width: '15%' }}>Mã tuyến</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32', width: '25%' }}>Tên tuyến</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32', width: '15%' }}>Ảnh đại diện</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32', width: '17%' }}>Chiều dài (km)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32', width: '20%' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary" fontStyle="italic">
                      Không có dữ liệu trên trang này
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoutes.map((route, index) => (
                  <TableRow 
                    key={route.id}
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fdf8',
                      '&:hover': { 
                        backgroundColor: '#e8f5e8',
                        transform: 'scale(1.002)', // ✅ GIẢM SCALE ĐỂ TRÁNH OVERFLOW
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    {/* ✅ CỘT STT */}
                    <TableCell sx={{ fontWeight: 'medium', width: '8%' }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    
                    <TableCell sx={{ fontWeight: 'medium', width: '15%' }}>
                      <Typography variant="body2" noWrap> {/* ✅ THÊM noWrap */}
                        {route.code || 'N/A'}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ width: '25%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }} noWrap> {/* ✅ THÊM noWrap */}
                        {route.name || 'Chưa có tên'}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ width: '15%' }}>
                      {route.thumbnailImageUrl && route.thumbnailImageUrl !== "empty" ? (
                        <Avatar 
                          src={route.thumbnailImageUrl} 
                          alt={route.name}
                          sx={{ 
                            border: '2px solid #81c784',
                            width: 40, // ✅ GIẢM SIZE ĐỂ FIT BETTER
                            height: 40
                          }}
                        />
                      ) : (
                        <Avatar 
                          src="https://picsum.photos/seed/metro21/100/100" 
                          alt="default"
                          sx={{ 
                            border: '2px solid #81c784',
                            width: 40, // ✅ GIẢM SIZE ĐỂ FIT BETTER
                            height: 40
                          }}
                        />
                      )}
                    </TableCell>
                    
                    {/* ✅ FORMAT CHIỀU DÀI VỚI 2 SỐ THẬP PHÂN */}
                    <TableCell sx={{ width: '17%' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }} noWrap>
                        {formatDecimal(route.lengthInKm)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell sx={{ width: '20%' }}>
                      <Button
                        component={Link}
                        to={`/metro-routes/${route.id}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#4caf50',
                          color: '#4caf50',
                          fontSize: '0.75rem', // ✅ GIẢM FONT SIZE
                          '&:hover': { 
                            borderColor: '#45a049',
                            backgroundColor: '#e8f5e8'
                          }
                        }}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ CẢI TIẾN PAGINATION */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {page * rowsPerPage + 1} đến {Math.min((page + 1) * rowsPerPage, metroRoutes.length)} của {metroRoutes.length} tuyến
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              size="small"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              sx={{
                color: page === 0 ? 'text.disabled' : '#4caf50',
                '&:hover': { backgroundColor: '#e8f5e8' }
              }}
            >
              Trước
            </Button>
            
            <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'center' }}>
              Trang {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </Typography>
            
            <Button
              size="small"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              sx={{
                color: page + 1 >= totalPages ? 'text.disabled' : '#4caf50',
                '&:hover': { backgroundColor: '#e8f5e8' }
              }}
            >
              Sau
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ViewRoutes;
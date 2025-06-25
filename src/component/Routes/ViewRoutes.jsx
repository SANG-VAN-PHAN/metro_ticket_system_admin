// import React, { useEffect, useState } from 'react';
// import {
//   Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Stack, Button, Autocomplete, TextField, CircularProgress
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import Avatar from '@mui/material/Avatar';

// const ViewRoutes = () => {
//   const [metroRoutes, setMetroRoutes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [stationOptions, setStationOptions] = useState([]);
//   const [stationLoading, setStationLoading] = useState(false);
//   const [searchInput, setSearchInput] = useState('');
//   const [filteredRoutes, setFilteredRoutes] = useState([]);
//   const [selectedStation, setSelectedStation] = useState(null);

//   useEffect(() => {
//     fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setMetroRoutes(data.data.routes);
//         setFilteredRoutes(data.data.routes);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   // Khi nhập vào ô search, chỉ cập nhật dropdown
//   const handleStationSearch = async (event, value) => {
//     setSearchInput(value || '');

//     if (!value) {
//       setStationOptions([]);
//       return;
//     }

//     setStationLoading(true);
//     try {
//       const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?name=${encodeURIComponent(value)}`);
//       const data = await res.json();
//       setStationOptions(data.data.stations || []);
//     } catch {
//       setStationOptions([]);
//     }
//     setStationLoading(false);
//   };

//   // Khi chọn station hoặc ấn Enter
//   const handleStationSelect = (event, value) => {
//     setSelectedStation(value);
//     if (value && value.id) {
//       setFilteredRoutes(
//         metroRoutes.filter(route =>
//           route.stations && route.stations.some(st => st.id === value.id)
//         )
//       );
//     } else {
//       setFilteredRoutes(metroRoutes);
//     }
//   };

//   // Bắt sự kiện Enter trong ô search
//   const handleKeyDown = (event) => {
//   if (event.key === 'Enter') {
//     if (!searchInput) {
//       setFilteredRoutes(metroRoutes);
//       return;
//     }
//     setFilteredRoutes(
//       metroRoutes.filter(route =>
//         route.name.toLowerCase().includes(searchInput.toLowerCase())
//       )
//     );
//   }
// };

//   if (loading) return <div>Loading...</div>;
//   if (!metroRoutes || metroRoutes.length === 0) return <div>Không có dữ liệu tuyến metro.</div>;

//   return (
//     <Card>
//       <Autocomplete
//   freeSolo
//   options={stationOptions}
//   getOptionLabel={(option) =>
//     typeof option === 'string'
//       ? option
//       : `${option.name} (${option.id})`
//   }
//   isOptionEqualToValue={(option, value) =>
//     typeof value === 'string'
//       ? false
//       : option.id === value.id
//   }
//   loading={stationLoading}
//   inputValue={searchInput}
//   onInputChange={handleStationSearch}
//   // KHÔNG dùng onChange để lọc khi nhập tự do
//   renderInput={(params) => (
//     <TextField
//       {...params}
//       label="Tìm kiếm Station"
//       onKeyDown={handleKeyDown}
//       InputProps={{
//         ...params.InputProps,
//         endAdornment: (
//           <>
//             {stationLoading ? <CircularProgress color="inherit" size={20} /> : null}
//             {params.InputProps.endAdornment}
//           </>
//         ),
//       }}
//     />
//   )}
// />
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
//               {filteredRoutes.map((route) => (
//                 <TableRow key={route.id}>
//                   <TableCell>{route.code}</TableCell>
//                   <TableCell>{route.name}</TableCell>
//                   <TableCell>
//                     {route.thumbnailImageUrl && route.thumbnailImageUrl !== "empty" ? (
//                       <Avatar src={route.thumbnailImageUrl} alt={route.name} />
//                     ) : (
//                       <Avatar src="https://picsum.photos/seed/metro21/100/100" alt="default" />
//                     )}
//                   </TableCell>
//                   <TableCell>{route.lengthInKm}</TableCell>
//                   <TableCell>
//                     <Button
//                       component={Link}
//                       to={`/metro-routes/${route.id}`}
//                       variant="outlined"
//                       size="small"
//                     >
//                       Xem chi tiết
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </CardContent>
//     </Card>
//   );
// };

// export default ViewRoutes;

import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Button, Autocomplete, TextField, CircularProgress, Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';

const ViewRoutes = () => {
  const [metroRoutes, setMetroRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stationOptions, setStationOptions] = useState([]);
  const [stationLoading, setStationLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(filteredRoutes.length / rowsPerPage);
  const paginatedRoutes = filteredRoutes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setMetroRoutes(data.data.routes);
        setFilteredRoutes(data.data.routes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Khi nhập vào ô search, chỉ cập nhật dropdown
  const handleStationSearch = async (event, value) => {
    setSearchInput(value || '');

    if (!value) {
      setStationOptions([]);
      return;
    }

    setStationLoading(true);
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?name=${encodeURIComponent(value)}`);
      const data = await res.json();
      setStationOptions(data.data.stations || []);
    } catch {
      setStationOptions([]);
    }
    setStationLoading(false);
  };

  // Khi chọn station hoặc ấn Enter
  const handleStationSelect = (event, value) => {
    setSelectedStation(value);
    setPage(0); // reset về trang đầu khi lọc
    if (value && value.id) {
      setFilteredRoutes(
        metroRoutes.filter(route =>
          route.stations && route.stations.some(st => st.id === value.id)
        )
      );
    } else {
      setFilteredRoutes(metroRoutes);
    }
  };

  // Bắt sự kiện Enter trong ô search
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setPage(0); // reset về trang đầu khi lọc
      if (!searchInput) {
        setFilteredRoutes(metroRoutes);
        return;
      }
      setFilteredRoutes(
        metroRoutes.filter(route =>
          route.name.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!metroRoutes || metroRoutes.length === 0) return <div>Không có dữ liệu tuyến metro.</div>;

  return (
    <Card>
      <Autocomplete
        freeSolo
        options={stationOptions}
        getOptionLabel={(option) =>
          typeof option === 'string'
            ? option
            : `${option.name} (${option.id})`
        }
        isOptionEqualToValue={(option, value) =>
          typeof value === 'string'
            ? false
            : option.id === value.id
        }
        loading={stationLoading}
        inputValue={searchInput}
        onInputChange={handleStationSearch}
        onChange={handleStationSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tìm kiếm Station"
            onKeyDown={handleKeyDown}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {stationLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách tuyến đường Metro
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button component={Link} to="/metro-routes/create" variant="contained" color="primary">
            Thêm tuyến mới
          </Button>
          <Button component={Link} to="/metro-routes/delete" variant="outlined" color="error">
            Xóa tuyến
          </Button>
          <Button component={Link} to="/metro-routes/update" variant="outlined" color="secondary">
            Cập nhật tuyến
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã tuyến (Code)</TableCell>
                <TableCell>Tên tuyến (Name)</TableCell>
                <TableCell>Ảnh đại diện</TableCell>
                <TableCell>Chiều dài (km)</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRoutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                paginatedRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.code}</TableCell>
                    <TableCell>{route.name}</TableCell>
                    <TableCell>
                      {route.thumbnailImageUrl && route.thumbnailImageUrl !== "empty" ? (
                        <Avatar src={route.thumbnailImageUrl} alt={route.name} />
                      ) : (
                        <Avatar src="https://picsum.photos/seed/metro21/100/100" alt="default" />
                      )}
                    </TableCell>
                    <TableCell>{route.lengthInKm}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`/metro-routes/${route.id}`}
                        variant="outlined"
                        size="small"
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2 }}>
          <Button
            size="small"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </Button>
          <Typography>
            Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
          </Typography>
          <Button
            size="small"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ViewRoutes;
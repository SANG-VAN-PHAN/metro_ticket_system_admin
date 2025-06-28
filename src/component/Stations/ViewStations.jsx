// // import React, { useEffect, useState } from 'react';
// // import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Button, Avatar } from '@mui/material';
// // import { Link } from 'react-router-dom';

// // const ViewStations = () => {
// //   const [stations, setStations] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
// //       headers: { 'Accept': 'application/json' }
// //     })
// //       .then(res => res.json())
// //       .then(data => {
// //         setStations(data.data.stations || []);
// //         setLoading(false);
// //       })
// //       .catch(() => setLoading(false));
// //   }, []);

// //   return (
// //     <Card>
// //       <CardContent>
// //         <Typography variant="h4" gutterBottom>
// //           Danh sách các ga Metro
// //         </Typography>
// //         <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
// //           <Button component={Link} to="/stations/create" variant="contained" color="primary">
// //             Thêm ga mới
// //           </Button>
// //           <Button component={Link} to="/stations/delete" variant="outlined" color="error">
// //             Xóa ga
// //           </Button>
// //           <Button component={Link} to="/stations/update" variant="outlined" color="secondary">
// //             Cập nhật ga
// //           </Button>
// //         </Stack>
// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Mã ga</TableCell>
// //                 <TableCell>Tên ga</TableCell>
// //                 <TableCell>Ảnh đại diện</TableCell>
// //                 <TableCell>Địa chỉ</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={4} align="center">Đang tải...</TableCell>
// //                 </TableRow>
// //               ) : stations.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
// //                 </TableRow>
// //               ) : (
// //                 stations.map((station) => (
// //                   <TableRow key={station.id}>
// //                     <TableCell>{station.code}</TableCell>
// //                     <TableCell>{station.name}</TableCell>
// //                     <TableCell>
// //                       {station.thumbnailImageUrl && station.thumbnailImageUrl !== 'empty' ? (
// //                         <Avatar src={station.thumbnailImageUrl} alt={station.name} />
// //                       ) : (
// //                         <Avatar>{station.name?.[0] || '?'}</Avatar>
// //                       )}
// //                     </TableCell>
// //                     <TableCell>
// //                       {[station.streetNumber, station.street, station.ward, station.district, station.city]
// //                         .filter(Boolean)
// //                         .join(', ') || 'Chưa cập nhật'}
// //                     </TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default ViewStations;

// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Button, Avatar } from '@mui/material';
// import { Link } from 'react-router-dom';

// const ViewStations = () => {
//   const [stations, setStations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const rowsPerPage = 5; // Cố định số dòng/trang

//   useEffect(() => {
//     fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setStations(data.data.stations || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   const totalPages = Math.ceil(stations.length / rowsPerPage);

//   // Lấy danh sách station cho trang hiện tại
//   const paginatedStations = stations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Danh sách các ga Metro
//         </Typography>
//         <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//           <Button component={Link} to="/stations/create" variant="contained" color="primary">
//             Thêm ga mới
//           </Button>
//           <Button component={Link} to="/stations/delete" variant="outlined" color="error">
//             Xóa ga
//           </Button>
//           <Button component={Link} to="/stations/update" variant="outlined" color="secondary">
//             Cập nhật ga
//           </Button>
//         </Stack>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Mã ga</TableCell>
//                 <TableCell>Tên ga</TableCell>
//                 <TableCell>Ảnh đại diện</TableCell>
//                 <TableCell>Địa chỉ</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={4} align="center">Đang tải...</TableCell>
//                 </TableRow>
//               ) : stations.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedStations.map((station) => (
//                   <TableRow key={station.id}>
//                     <TableCell>{station.code}</TableCell>
//                     <TableCell>{station.name}</TableCell>
//                     <TableCell>
//                       {station.thumbnailImageUrl && station.thumbnailImageUrl !== 'empty' ? (
//                         <Avatar src={station.thumbnailImageUrl} alt={station.name} />
//                       ) : (
//                         <Avatar>{station.name?.[0] || '?'}</Avatar>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {[station.streetNumber, station.street, station.ward, station.district, station.city]
//                         .filter(Boolean)
//                         .join(', ') || 'Chưa cập nhật'}
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

// export default ViewStations;








import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Button, Avatar, TextField, Autocomplete, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

const ViewStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // ✅ THÊM SEARCH FUNCTIONALITY TỪ VIEWROUTES
  const [stationOptions, setStationOptions] = useState([]);
  const [stationLoading, setStationLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // Calculate pagination based on filtered results
  const totalPages = Math.ceil(filteredStations.length / rowsPerPage);
  const paginatedStations = filteredStations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setStations(data.data.stations || []);
        setFilteredStations(data.data.stations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ SEARCH FUNCTIONALITY
  // Khi nhập vào ô search, cập nhật dropdown
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

  // Khi chọn station từ dropdown
  const handleStationSelect = (event, value) => {
    setSelectedStation(value);
    setPage(0); // reset về trang đầu khi lọc
    
    if (value && value.id) {
      // Lọc station theo ID được chọn
      setFilteredStations(
        stations.filter(station => station.id === value.id)
      );
    } else {
      setFilteredStations(stations);
    }
  };

  // Bắt sự kiện Enter trong ô search để tìm theo tên
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setPage(0); // reset về trang đầu khi lọc
      
      if (!searchInput) {
        setFilteredStations(stations);
        return;
      }
      
      // Tìm kiếm theo tên station
      setFilteredStations(
        stations.filter(station =>
          station.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          station.code.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  };

  // Reset tìm kiếm
  const handleClearSearch = () => {
    setSearchInput('');
    setSelectedStation(null);
    setStationOptions([]);
    setFilteredStations(stations);
    setPage(0);
  };

  return (
    <Card>
      {/* ✅ SEARCH SECTION */}
      <CardContent sx={{ pb: 0 }}>
        <Autocomplete
          freeSolo
          options={stationOptions}
          getOptionLabel={(option) =>
            typeof option === 'string'
              ? option
              : `${option.name} (${option.code})`
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
              label="Tìm kiếm ga Metro (Enter để tìm theo tên)"
              placeholder="Nhập tên ga hoặc mã ga..."
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
      </CardContent>

      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách các ga Metro
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button component={Link} to="/stations/create" variant="contained" color="primary">
            Thêm ga mới
          </Button>
          <Button component={Link} to="/stations/delete" variant="outlined" color="error">
            Xóa ga
          </Button>
          <Button component={Link} to="/stations/update" variant="outlined" color="secondary">
            Cập nhật ga
          </Button>
          {(searchInput || selectedStation) && (
            <Button onClick={handleClearSearch} variant="outlined">
              Xóa bộ lọc
            </Button>
          )}
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã ga</TableCell>
                <TableCell>Tên ga</TableCell>
                <TableCell>Ảnh đại diện</TableCell>
                <TableCell>Địa chỉ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : filteredStations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {searchInput || selectedStation ? 'Không tìm thấy ga phù hợp' : 'Không có dữ liệu'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.code}</TableCell>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>
                      {station.thumbnailImageUrl && station.thumbnailImageUrl !== 'empty' ? (
                        <Avatar src={station.thumbnailImageUrl} alt={station.name} />
                      ) : (
                        <Avatar>{station.name?.[0] || '?'}</Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      {[station.streetNumber, station.street, station.ward, station.district, station.city]
                        .filter(Boolean)
                        .join(', ') || 'Chưa cập nhật'}
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
          <Typography variant="body2" color="text.secondary">
            (Hiển thị {paginatedStations.length} / {filteredStations.length} ga)
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

export default ViewStations;
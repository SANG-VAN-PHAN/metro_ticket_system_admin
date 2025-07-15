// import React, { useEffect, useState } from 'react';
// import {
//     Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
//     TableHead, TableRow, Paper, Stack, Button, Avatar, TextField, Autocomplete, 
//     CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
// } from '@mui/material';
// import { Link } from 'react-router-dom';

// const ViewStations = () => {
//     const [stations, setStations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(0);
//     const rowsPerPage = 5;

//     // SEARCH STATE
//     const [stationOptions, setStationOptions] = useState([]);
//     const [stationLoading, setStationLoading] = useState(false);
//     const [searchInput, setSearchInput] = useState('');
//     const [filteredStations, setFilteredStations] = useState([]);
//     const [selectedStation, setSelectedStation] = useState(null);

//     // DELETE DIALOG STATE
//     const [deleteDialog, setDeleteDialog] = useState(false);
//     const [stationToDelete, setStationToDelete] = useState(null);
//     const [deleting, setDeleting] = useState(false);
//     const [deleteSuccess, setDeleteSuccess] = useState(false);
//     const [deleteError, setDeleteError] = useState('');

//     // pagination
//     const totalPages = Math.ceil(filteredStations.length / rowsPerPage);
//     const paginatedStations = filteredStations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     useEffect(() => {
//         fetchStations();
//     }, []);

//     const fetchStations = () => {
//         fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
//             headers: { 'Accept': 'application/json' }
//         })
//             .then(res => res.json())
//             .then(data => {
//                 console.log('All stations API response:', data); // Debug log
//                 const list = data.data?.stations || [];
//                 setStations(list);
//                 setFilteredStations(list);
//                 setLoading(false);
//             })
//             .catch(() => setLoading(false));
//     };

//     // SEARCH HANDLERS - Chỉ hiển thị gợi ý từ stations hiện có
//     const handleStationSearch = async (e, value) => {
//         setSearchInput(value || '');
//         if (!value || value.length < 2) {
//             setStationOptions([]);
//             return;
//         }
        
//         // Tìm kiếm local trong stations hiện có thay vì gọi API search
//         const q = value.toLowerCase();
//         const localResults = stations.filter(
//             s => s.name.toLowerCase().includes(q) || 
//                  (s.code && s.code.toLowerCase().includes(q))
//         );
//         setStationOptions(localResults);
//     };

//     const handleStationSelect = (e, value) => {
//         setSelectedStation(value);
//         setPage(0);
//         if (value && value.id) {
//             setFilteredStations(stations.filter(s => s.id === value.id));
//         } else {
//             setFilteredStations(stations);
//         }
//     };

//     const handleKeyDown = async (e) => {
//         if (e.key === 'Enter') {
//             setPage(0);
//             if (!searchInput) {
//                 setFilteredStations(stations);
//             } else {
//                 // Chỉ tìm kiếm local trong stations hiện có
//                 const q = searchInput.toLowerCase();
//                 const localResults = stations.filter(
//                     s => s.name.toLowerCase().includes(q) || 
//                          (s.code && s.code.toLowerCase().includes(q))
//                 );
//                 setFilteredStations(localResults);
//             }
//         }
//     };

//     const handleClearSearch = () => {
//         setSearchInput('');
//         setSelectedStation(null);
//         setStationOptions([]);
//         setFilteredStations(stations);
//         setPage(0);
//     };

//     // DELETE HANDLERS
//     const handleDeleteClick = (station) => {
//         setStationToDelete(station);
//         setDeleteDialog(true);
//     };

//     const handleDeleteConfirm = async () => {
//         if (!stationToDelete) return;
//         setDeleting(true);
//         setDeleteError('');
        
//         try {
//             const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations/${stationToDelete.id}`, {
//                 method: 'DELETE',
//                 headers: { 'Accept': 'application/json' }
//             });
            
//             if (!res.ok) {
//                 const msg = await res.text();
//                 throw new Error(msg || 'Xóa thất bại');
//             }
            
//             setDeleteSuccess(true);
//             setDeleteDialog(false);
//             fetchStations(); // Reload data
//         } catch (err) {
//             setDeleteError('Xóa thất bại: ' + err.message);
//         } finally {
//             setDeleting(false);
//         }
//     };

//     const handleDeleteCancel = () => {
//         setDeleteDialog(false);
//         setStationToDelete(null);
//     };

//     return (
//         <Card>
//             {/* SEARCH */}
//             <CardContent sx={{ pb: 0 }}>
//                 <Autocomplete
//                     freeSolo
//                     options={Array.isArray(stationOptions) ? stationOptions : []}
//                     getOptionLabel={opt => typeof opt === 'string' ? opt : `${opt.name}${opt.code ? ' (' + opt.code + ')' : ''}`}
//                     isOptionEqualToValue={(opt, val) => typeof val !== 'string' && opt.id === val.id}
//                     loading={stationLoading}
//                     inputValue={searchInput}
//                     onInputChange={handleStationSearch}
//                     onChange={handleStationSelect}
//                     renderInput={params => (
//                         <TextField
//                             {...params}
//                             label="Tìm kiếm ga Metro (Enter để tìm)"
//                             placeholder="Tên ga... (ít nhất 2 ký tự)"
//                             onKeyDown={handleKeyDown}
//                             InputProps={{
//                                 ...params.InputProps,
//                                 endAdornment: (
//                                     <>
//                                         {stationLoading && <CircularProgress size={20} color="inherit" />}
//                                         {params.InputProps.endAdornment}
//                                     </>
//                                 )
//                             }}
//                         />
//                     )}
//                 />
//             </CardContent>

//             <CardContent>
//                 <Typography variant="h4" gutterBottom>
//                     Danh sách các ga Metro
//                 </Typography>
//                 <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//                     <Button component={Link} to="/stations/create" variant="contained" color="primary">
//                         Thêm ga mới
//                     </Button>
//                     {(searchInput || selectedStation) && (
//                         <Button onClick={handleClearSearch} variant="outlined">
//                             Xóa bộ lọc
//                         </Button>
//                     )}
//                 </Stack>

//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Mã ga</TableCell>
//                                 <TableCell>Tên ga</TableCell>
//                                 <TableCell>Ảnh đại diện</TableCell>
//                                 <TableCell>Địa chỉ</TableCell>
//                                 <TableCell>Thao tác</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={5} align="center">Đang tải...</TableCell>
//                                 </TableRow>
//                             ) : filteredStations.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={5} align="center">
//                                         {searchInput || selectedStation
//                                             ? 'Không tìm thấy ga phù hợp'
//                                             : 'Không có dữ liệu'}
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 paginatedStations.map(station => (
//                                     <TableRow key={station.id}>
//                                         <TableCell>{station.code || 'Chưa có'}</TableCell>
//                                         <TableCell>{station.name}</TableCell>
//                                         <TableCell>
//                                             {station.thumbnailImageUrl && station.thumbnailImageUrl !== 'empty'
//                                                 ? <Avatar src={station.thumbnailImageUrl} alt={station.name} />
//                                                 : <Avatar>{station.name?.[0] || '?'}</Avatar>}
//                                         </TableCell>
//                                         <TableCell>
//                                             {[station.streetNumber, station.street, station.ward, station.district, station.city]
//                                                 .filter(Boolean).join(', ') || 'Chưa cập nhật'}
//                                         </TableCell>
//                                         <TableCell>
//                                             <Stack direction="row" spacing={1}>
//                                                 <Button
//                                                     component={Link}
//                                                     to={`/stations/${station.id}`}
//                                                     variant="outlined"
//                                                     size="small"
//                                                 >
//                                                     Chi tiết
//                                                 </Button>
//                                                 <Button
//                                                     component={Link}
//                                                     to={`/stations/update/${station.id}`}
//                                                     variant="outlined"
//                                                     size="small"
//                                                 >
//                                                     Cập nhật
//                                                 </Button>
//                                                 <Button
//                                                     onClick={() => handleDeleteClick(station)}
//                                                     variant="outlined"
//                                                     size="small"
//                                                     color="error"
//                                                 >
//                                                     Xóa
//                                                 </Button>
//                                             </Stack>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2 }}>
//                     <Button size="small" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
//                         Trước
//                     </Button>
//                     <Typography>
//                         Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                         (Hiển thị {paginatedStations.length} / {filteredStations.length} ga)
//                     </Typography>
//                     <Button size="small" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
//                         Sau
//                     </Button>
//                 </Stack>
//             </CardContent>

//             {/* DELETE CONFIRMATION DIALOG */}
//             <Dialog open={deleteDialog} onClose={handleDeleteCancel}>
//                 <DialogTitle>Xác nhận xóa ga</DialogTitle>
//                 <DialogContent>
//                     <Typography>
//                         Bạn có chắc chắn muốn xóa ga "{stationToDelete?.name}"?
//                     </Typography>
//                     <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//                         Hành động này không thể hoàn tác!
//                     </Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDeleteCancel} disabled={deleting}>
//                         Hủy
//                     </Button>
//                     <Button 
//                         onClick={handleDeleteConfirm} 
//                         color="error" 
//                         variant="contained"
//                         disabled={deleting}
//                     >
//                         {deleting ? 'Đang xóa...' : 'Xóa'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* SUCCESS/ERROR SNACKBARS */}
//             <Snackbar
//                 open={deleteSuccess}
//                 autoHideDuration={3000}
//                 onClose={() => setDeleteSuccess(false)}
//             >
//                 <Alert severity="success">Xóa ga thành công!</Alert>
//             </Snackbar>
            
//             <Snackbar
//                 open={!!deleteError}
//                 autoHideDuration={4000}
//                 onClose={() => setDeleteError('')}
//             >
//                 <Alert severity="error">{deleteError}</Alert>
//             </Snackbar>
//         </Card>
//     );
// };

// export default ViewStations;





import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Stack, Button, Avatar, TextField, Autocomplete, 
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

const ViewStations = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 8;

    // SEARCH STATE
    const [stationOptions, setStationOptions] = useState([]);
    const [stationLoading, setStationLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [selectedStation, setSelectedStation] = useState(null);

    // DELETE DIALOG STATE
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [stationToDelete, setStationToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        fetchStations();
    }, [page, searchInput, selectedStation]);

    const fetchStations = () => {
        setLoading(true);
        
        // Tạo query parameters
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });

        // Thêm search parameters nếu có
        if (searchInput.trim()) {
            params.append('name', searchInput.trim());
        }

        fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?${params.toString()}`, {
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Stations API response:', data);
                if (data.succeeded && data.data) {
                    setStations(data.data.stations || []);
                    setTotalPages(data.data.totalPages || 0);
                } else {
                    setStations([]);
                    setTotalPages(0);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch stations error:', err);
                setStations([]);
                setTotalPages(0);
                setLoading(false);
            });
    };

    // SEARCH HANDLERS
    const handleStationSearch = async (e, value) => {
        setSearchInput(value || '');
        setPage(0); // Reset về trang đầu khi search
        
        if (!value || value.length < 2) {
            setStationOptions([]);
            return;
        }
        
        setStationLoading(true);
        
        // Tìm kiếm qua API
        const params = new URLSearchParams({
            page: '0',
            pageSize: '10', // Lấy 10 kết quả cho autocomplete
            name: value
        });

        try {
            const response = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?${params.toString()}`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            
            if (data.succeeded && data.data) {
                setStationOptions(data.data.stations || []);
            } else {
                setStationOptions([]);
            }
        } catch (err) {
            console.error('Search error:', err);
            setStationOptions([]);
        } finally {
            setStationLoading(false);
        }
    };

    const handleStationSelect = (e, value) => {
        setSelectedStation(value);
        setPage(0); // Reset về trang đầu
        
        if (value && value.name) {
            setSearchInput(value.name);
        } else {
            setSearchInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setPage(0); // Reset về trang đầu
            fetchStations();
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSelectedStation(null);
        setStationOptions([]);
        setPage(0);
    };

    // PAGINATION HANDLERS
    const handlePrevPage = () => {
        setPage(prev => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    // DELETE HANDLERS
    const handleDeleteClick = (station) => {
        console.log('Station to delete:', station);
        setStationToDelete(station);
        setDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!stationToDelete) return;
        setDeleting(true);
        setDeleteError('');
        
        console.log('Deleting station ID:', stationToDelete.id);
        
        try {
            const response = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations/${stationToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            
            console.log('Delete response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.log('Delete error response:', errorText);
                throw new Error(errorText || 'Không thể xóa ga');
            }
            
            // Xóa station khỏi state local ngay lập tức
            setStations(prev => prev.filter(station => station.id !== stationToDelete.id));
            
            setDeleteSuccess(true);
            setDeleteDialog(false);
            
            // Delay một chút rồi mới fetch lại để đảm bảo API đã cập nhật
            setTimeout(() => {
                fetchStations();
            }, 1000);
            
        } catch (err) {
            console.error('Delete error:', err);
            setDeleteError(err.message || 'Có lỗi xảy ra khi xóa ga');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog(false);
        setStationToDelete(null);
    };

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Danh sách các ga Metro
                    </Typography>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            {/* SEARCH */}
            <CardContent sx={{ pb: 0 }}>
                <Autocomplete
                    freeSolo
                    options={Array.isArray(stationOptions) ? stationOptions : []}
                    getOptionLabel={opt => typeof opt === 'string' ? opt : `${opt.name}${opt.code ? ' (' + opt.code + ')' : ''}`}
                    isOptionEqualToValue={(opt, val) => typeof val !== 'string' && opt.id === val.id}
                    loading={stationLoading}
                    inputValue={searchInput}
                    onInputChange={handleStationSearch}
                    onChange={handleStationSelect}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Tìm kiếm ga Metro (Enter để tìm)"
                            placeholder="Tên ga... (ít nhất 2 ký tự)"
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {stationLoading && <CircularProgress size={20} color="inherit" />}
                                        {params.InputProps.endAdornment}
                                    </>
                                )
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
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {searchInput || selectedStation
                                            ? 'Không tìm thấy ga phù hợp'
                                            : 'Không có dữ liệu'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stations.map(station => (
                                    <TableRow key={station.id}>
                                        <TableCell>{station.code || 'Chưa có'}</TableCell>
                                        <TableCell>{station.name}</TableCell>
                                        <TableCell>
                                            {station.thumbnailImageUrl && station.thumbnailImageUrl !== 'empty'
                                                ? <Avatar src={station.thumbnailImageUrl} alt={station.name} />
                                                : <Avatar>{station.name?.[0] || '?'}</Avatar>}
                                        </TableCell>
                                        <TableCell>
                                            {[station.streetNumber, station.street, station.ward, station.district, station.city]
                                                .filter(Boolean).join(', ') || 'Chưa cập nhật'}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    component={Link}
                                                    to={`/stations/${station.id}`}
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    Chi tiết
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={`/stations/update/${station.id}`}
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    Cập nhật
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(station)}
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                >
                                                    Xóa
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* PAGINATION - Chỉ hiển thị khi có nhiều hơn 1 trang */}
                {totalPages > 1 && (
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                        <Button 
                            size="small" 
                            disabled={page === 0} 
                            onClick={handlePrevPage}
                            variant="outlined"
                        >
                            Trước
                        </Button>
                        <Typography>
                            Trang {page + 1} / {totalPages}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            (Hiển thị {stations.length} / {totalPages * pageSize} ga)
                        </Typography>
                        <Button 
                            size="small" 
                            disabled={page >= totalPages - 1} 
                            onClick={handleNextPage}
                            variant="outlined"
                        >
                            Sau
                        </Button>
                    </Stack>
                )}
            </CardContent>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteDialog} onClose={handleDeleteCancel}>
                <DialogTitle>Xác nhận xóa ga</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa ga "{stationToDelete?.name}"?
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        Hành động này không thể hoàn tác!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleting}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SUCCESS/ERROR SNACKBARS */}
            <Snackbar
                open={deleteSuccess}
                autoHideDuration={3000}
                onClose={() => setDeleteSuccess(false)}
            >
                <Alert severity="success">Xóa ga thành công!</Alert>
            </Snackbar>
            
            <Snackbar
                open={!!deleteError}
                autoHideDuration={4000}
                onClose={() => setDeleteError('')}
            >
                <Alert severity="error">{deleteError}</Alert>
            </Snackbar>
        </Card>
    );
};

export default ViewStations;
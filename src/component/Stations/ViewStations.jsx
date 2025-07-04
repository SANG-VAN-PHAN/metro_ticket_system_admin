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
    const rowsPerPage = 5;

    // SEARCH STATE
    const [stationOptions, setStationOptions] = useState([]);
    const [stationLoading, setStationLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filteredStations, setFilteredStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);

    // DELETE DIALOG STATE
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [stationToDelete, setStationToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // pagination
    const totalPages = Math.ceil(filteredStations.length / rowsPerPage);
    const paginatedStations = filteredStations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = () => {
        fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                const list = data.data.stations || [];
                setStations(list);
                setFilteredStations(list);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // SEARCH HANDLERS
    const handleStationSearch = async (e, value) => {
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

    const handleStationSelect = (e, value) => {
        setSelectedStation(value);
        setPage(0);
        if (value && value.id) {
            setFilteredStations(stations.filter(s => s.id === value.id));
        } else {
            setFilteredStations(stations);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setPage(0);
            if (!searchInput) {
                setFilteredStations(stations);
            } else {
                const q = searchInput.toLowerCase();
                setFilteredStations(stations.filter(
                    s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
                ));
            }
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSelectedStation(null);
        setStationOptions([]);
        setFilteredStations(stations);
        setPage(0);
    };

    // DELETE HANDLERS
    const handleDeleteClick = (station) => {
        setStationToDelete(station);
        setDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!stationToDelete) return;
        setDeleting(true);
        setDeleteError('');
        
        try {
            const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations/${stationToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Xóa thất bại');
            }
            
            setDeleteSuccess(true);
            setDeleteDialog(false);
            fetchStations(); // Reload data
        } catch (err) {
            setDeleteError('Xóa thất bại: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog(false);
        setStationToDelete(null);
    };

    return (
        <Card>
            {/* SEARCH */}
            <CardContent sx={{ pb: 0 }}>
                <Autocomplete
                    freeSolo
                    options={stationOptions}
                    getOptionLabel={opt => typeof opt === 'string' ? opt : `${opt.name} (${opt.code})`}
                    isOptionEqualToValue={(opt, val) => typeof val !== 'string' && opt.id === val.id}
                    loading={stationLoading}
                    inputValue={searchInput}
                    onInputChange={handleStationSearch}
                    onChange={handleStationSelect}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Tìm kiếm ga Metro (Enter để tìm)"
                            placeholder="Tên hoặc mã ga..."
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : filteredStations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {searchInput || selectedStation
                                            ? 'Không tìm thấy ga phù hợp'
                                            : 'Không có dữ liệu'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedStations.map(station => (
                                    <TableRow key={station.id}>
                                        <TableCell>{station.code}</TableCell>
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

                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                    <Button size="small" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        Trước
                    </Button>
                    <Typography>
                        Trang {totalPages === 0 ? 0 : page + 1}/{totalPages}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        (Hiển thị {paginatedStations.length} / {filteredStations.length} ga)
                    </Typography>
                    <Button size="small" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
                        Sau
                    </Button>
                </Stack>
            </CardContent>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteDialog} onClose={handleDeleteCancel}>
                <DialogTitle>Xác nhận xóa ga</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa ga "{stationToDelete?.name}" (Mã: {stationToDelete?.code})?
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
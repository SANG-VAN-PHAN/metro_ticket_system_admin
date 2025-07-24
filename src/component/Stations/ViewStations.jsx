import React, { useEffect, useState, useRef } from 'react';
import {
    Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Stack, Button, Avatar, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

const ViewStations = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 8;

    // SEARCH STATE
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // DELETE DIALOG STATE
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [stationToDelete, setStationToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        fetchStations();
        // eslint-disable-next-line
    }, [page, debouncedSearch]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const fetchStations = () => {
        setLoading(true);
        // Tạo query parameters
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        // Thêm search parameters nếu có
        if (debouncedSearch.trim()) {
            params.append('name', debouncedSearch.trim());
        }
        fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?${params.toString()}`, {
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                if (data.succeeded && data.data) {
                    setStations(data.data.stations || []);
                    setTotalPages(data.data.totalPages || 0);
                } else {
                    setStations([]);
                    setTotalPages(0);
                }
                setLoading(false);
            })
            .catch(() => {
                setStations([]);
                setTotalPages(0);
                setLoading(false);
            });
    };

    // SEARCH HANDLER
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        setPage(0); // Reset về trang đầu khi search
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
        setStationToDelete(station);
        setDeleteDialog(true);
    };
    const handleDeleteConfirm = async () => {
        if (!stationToDelete) return;
        setDeleting(true);
        setDeleteError('');
        try {
            const response = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations/${stationToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Không thể xóa ga');
            }
            setStations(prev => prev.filter(station => station.id !== stationToDelete.id));
            setDeleteSuccess(true);
            setDeleteDialog(false);
            setTimeout(() => {
                fetchStations();
            }, 1000);
        } catch (err) {
            setDeleteError(err.message || 'Có lỗi xảy ra khi xóa ga');
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
            <CardContent>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                    Quản lý ga Metro
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button component={Link} to="/stations/create" variant="contained" color="primary">
                        Thêm ga mới
                    </Button>
                </Stack>
                <TextField
                    label="Tìm kiếm ga Metro theo tên"
                    placeholder="Nhập tên ga..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    fullWidth
                    size="small"
                    sx={{ mb: 2, maxWidth: 400 }}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Mã ga</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tên ga</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Ảnh đại diện</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Địa chỉ</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress size={28} sx={{ my: 2 }} />
                                    </TableCell>
                                </TableRow>
                            ) : stations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {searchInput
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
                                                ? <Avatar src={station.thumbnailImageUrl} alt={station.name} variant="rounded" sx={{ width: 56, height: 40, borderRadius: 2 }} />
                                                : <Avatar variant="rounded" sx={{ width: 56, height: 40, borderRadius: 2 }}>{station.name?.[0] || '?'}</Avatar>}
                                        </TableCell>
                                        <TableCell>
                                            {[station.streetNumber, station.street, station.ward, station.district, station.city]
                                                .filter(Boolean).join(', ') || 'Chưa cập nhật'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
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
                        <Typography sx={{ alignSelf: 'center' }}>
                            Trang {page + 1} / {totalPages}
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
import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Stack, Button, Avatar, TextField, Autocomplete, 
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

const ViewRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    // SEARCH STATE
    const [routeOptions, setRouteOptions] = useState([]);
    const [routeLoading, setRouteLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

    // DELETE DIALOG STATE
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [routeToDelete, setRouteToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // pagination
    const totalPages = Math.ceil(filteredRoutes.length / rowsPerPage);
    const paginatedRoutes = filteredRoutes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = () => {
        fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                const list = data.data.routes || [];
                setRoutes(list);
                setFilteredRoutes(list);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // SEARCH HANDLERS
    const handleRouteSearch = async (e, value) => {
        setSearchInput(value || '');
        if (!value) {
            setRouteOptions([]);
            return;
        }
        setRouteLoading(true);
        try {
            const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes?name=${encodeURIComponent(value)}`);
            const data = await res.json();
            setRouteOptions(data.data.routes || []);
        } catch {
            setRouteOptions([]);
        }
        setRouteLoading(false);
    };

    const handleRouteSelect = (e, value) => {
        setSelectedRoute(value);
        setPage(0);
        if (value && value.id) {
            setFilteredRoutes(routes.filter(r => r.id === value.id));
        } else {
            setFilteredRoutes(routes);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setPage(0);
            if (!searchInput) {
                setFilteredRoutes(routes);
            } else {
                const q = searchInput.toLowerCase();
                setFilteredRoutes(routes.filter(
                    r => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
                ));
            }
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSelectedRoute(null);
        setRouteOptions([]);
        setFilteredRoutes(routes);
        setPage(0);
    };

    // DELETE HANDLERS
    const handleDeleteClick = (route) => {
        setRouteToDelete(route);
        setDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!routeToDelete) return;
        setDeleting(true);
        setDeleteError('');
        
        try {
            const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${routeToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Xóa thất bại');
            }
            
            setDeleteSuccess(true);
            setDeleteDialog(false);
            fetchRoutes(); // Reload data
        } catch (err) {
            setDeleteError('Xóa thất bại: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog(false);
        setRouteToDelete(null);
    };

    return (
        <Card>
            {/* SEARCH */}
            <CardContent sx={{ pb: 0 }}>
                <Autocomplete
                    freeSolo
                    options={routeOptions}
                    getOptionLabel={opt => typeof opt === 'string' ? opt : `${opt.name} (${opt.code})`}
                    isOptionEqualToValue={(opt, val) => typeof val !== 'string' && opt.id === val.id}
                    loading={routeLoading}
                    inputValue={searchInput}
                    onInputChange={handleRouteSearch}
                    onChange={handleRouteSelect}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Tìm kiếm tuyến Metro (Enter để tìm)"
                            placeholder="Tên hoặc mã tuyến..."
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {routeLoading && <CircularProgress size={20} color="inherit" />}
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
                    Danh sách các tuyến Metro
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button component={Link} to="/metro-routes/create" variant="contained" color="primary">
                        Thêm tuyến mới
                    </Button>
                    {(searchInput || selectedRoute) && (
                        <Button onClick={handleClearSearch} variant="outlined">
                            Xóa bộ lọc
                        </Button>
                    )}
                </Stack>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã tuyến</TableCell>
                                <TableCell>Tên tuyến</TableCell>
                                <TableCell>Ảnh đại diện</TableCell>
                                <TableCell>Chiều dài (km)</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : filteredRoutes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {searchInput || selectedRoute
                                            ? 'Không tìm thấy tuyến phù hợp'
                                            : 'Không có dữ liệu'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedRoutes.map(route => (
                                    <TableRow key={route.id}>
                                        <TableCell>{route.code}</TableCell>
                                        <TableCell>{route.name}</TableCell>
                                        <TableCell>
                                            {route.thumbnailImageUrl && route.thumbnailImageUrl !== 'empty'
                                                ? <Avatar src={route.thumbnailImageUrl} alt={route.name} />
                                                : <Avatar>{route.name?.[0] || '?'}</Avatar>}
                                        </TableCell>
                                        <TableCell>{route.lengthInKm}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    component={Link}
                                                    to={`/metro-routes/${route.id}`}
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    Chi tiết
                                                </Button>
                                                <Button
                                                    component={Link}
                                                    to={`/metro-routes/update/${route.id}`}
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    Cập nhật
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteClick(route)}
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
                        (Hiển thị {paginatedRoutes.length} / {filteredRoutes.length} tuyến)
                    </Typography>
                    <Button size="small" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
                        Sau
                    </Button>
                </Stack>
            </CardContent>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteDialog} onClose={handleDeleteCancel}>
                <DialogTitle>Xác nhận xóa tuyến</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa tuyến "{routeToDelete?.name}" (Mã: {routeToDelete?.code})?
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
                <Alert severity="success">Xóa tuyến thành công!</Alert>
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

export default ViewRoutes;
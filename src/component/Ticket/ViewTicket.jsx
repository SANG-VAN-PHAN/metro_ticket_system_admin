import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, CircularProgress, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert, TextField,
  MenuItem, Collapse, Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

// Hàm format số tiền với phân cách hàng nghìn
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Hàm chuyển đổi loại vé thành text
const ticketTypeToText = (type) => {
  switch (type) {
    case 1: return 'Vé lượt';
    case 2: return 'Vé ngày';
    case 3: return 'Vé học sinh sinh viên';
    default: return 'Khác';
  }
};

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]); // Store current page tickets
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;
  
  // FILTER STATE
  const [filterOpen, setFilterOpen] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    ticketType: '',
    status: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    ticketType: '',
    status: ''
  });

  // DELETE DIALOG STATE
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Debounce ticket name search
  useEffect(() => {
    const handler = setTimeout(() => {
      setAppliedFilters({ ...filters });
    }, 400);
    return () => clearTimeout(handler);
  }, [filters.name]);

  useEffect(() => {
    fetchTickets();
  }, [page, appliedFilters]);

  const fetchTickets = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    if (appliedFilters.name) params.append('name', appliedFilters.name);
    if (appliedFilters.minPrice) params.append('minPrice', appliedFilters.minPrice);
    if (appliedFilters.maxPrice) params.append('maxPrice', appliedFilters.maxPrice);
    if (appliedFilters.ticketType) params.append('ticketType', appliedFilters.ticketType);
    if (appliedFilters.status !== '') params.append('status', appliedFilters.status);
    fetch(`https://api.metroticketingsystem.site/api/catalog/Tickets/filter?${params.toString()}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        let ticketList = [];
        let totalPageCount = 0;
        if (data.succeeded && data.data) {
          if (Array.isArray(data.data.tickets)) {
            ticketList = data.data.tickets;
            totalPageCount = data.data.totalPages || 0;
          } else if (Array.isArray(data.data)) {
            ticketList = data.data;
            totalPageCount = data.data.totalPages || 0;
          }
        }
        setTickets(ticketList);
        setTotalPages(totalPageCount);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // FILTER HANDLERS
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    setAppliedFilters({ ...filters });
    setPage(0); // Reset về trang đầu
  };

  const handleClearFilter = () => {
    setFilters({
      name: '',
      minPrice: '',
      maxPrice: '',
      ticketType: '',
      status: ''
    });
    setAppliedFilters({
      name: '',
      minPrice: '',
      maxPrice: '',
      ticketType: '',
      status: ''
    });
    setPage(0);
  };

  // DELETE HANDLERS
  const handleDeleteClick = (ticket) => {
    console.log('Ticket to delete:', ticket);
    setTicketToDelete(ticket);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete) return;
    setDeleting(true);
    setDeleteError('');
    
    console.log('Deleting ticket ID:', ticketToDelete.id);
    
    try {
      const response = await fetch(`https://api.metroticketingsystem.site/api/catalog/Tickets/${ticketToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Delete error response:', errorText);
        throw new Error(errorText || 'Không thể xóa vé');
      }
      
      // Xóa ticket khỏi state local ngay lập tức
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketToDelete.id));
      
      setDeleteSuccess(true);
      setDeleteDialog(false);
      
      // Delay một chút rồi mới fetch lại để đảm bảo API đã cập nhật
      setTimeout(() => {
        fetchTickets();
      }, 1000);
      
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.message || 'Có lỗi xảy ra khi xóa vé');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
    setTicketToDelete(null);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Quản lý vé Metro
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button 
            component={Link} 
            to="/ticket/create" 
            variant="contained" 
            color="primary"
          >
            Thêm vé mới
          </Button>
        </Stack>
        {/* Filter Section - always visible */}
        <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Stack spacing={2}>
            <TextField
              label="Tên vé"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              fullWidth
              size="small"
              placeholder="Nhập tên vé cần tìm"
              sx={{ maxWidth: 400 }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Giá tối thiểu"
                name="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={handleFilterChange}
                fullWidth
                size="small"
                placeholder="VNĐ"
              />
              <TextField
                label="Giá tối đa"
                name="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                fullWidth
                size="small"
                placeholder="VNĐ"
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Loại vé"
                name="ticketType"
                value={filters.ticketType}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="1">Vé lượt</MenuItem>
                <MenuItem value="2">Vé ngày</MenuItem>
                <MenuItem value="3">Vé học sinh sinh viên</MenuItem>
              </TextField>
              <TextField
                select
                label="Trạng thái"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="false">Đang hoạt động</MenuItem>
                <MenuItem value="true">Không hoạt động</MenuItem>
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button 
                onClick={handleApplyFilter}
                variant="contained"
                color="primary"
              >
                Tìm kiếm
              </Button>
            </Stack>
          </Stack>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Tên vé</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thời hạn (ngày)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Giá (VNĐ)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Loại vé</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hiệu lực (ngày)</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={28} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có dữ liệu vé
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.name}</TableCell>
                    <TableCell>{ticket.expirationInDay}</TableCell>
                    <TableCell>{ticket.ticketType === 1 ? 'Theo khoảng cách' : formatPrice(ticket.price)}</TableCell>
                    <TableCell>{ticketTypeToText(ticket.ticketType)}</TableCell>
                    <TableCell>{ticket.activeInDay}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          component={Link}
                          to={`/ticket/${ticket.id}`}
                          variant="outlined"
                          size="small"
                        >
                          Chi tiết
                        </Button>
                        <Button
                          component={Link}
                          to={`/ticket/update/${ticket.id}`}
                          variant="outlined"
                          size="small"
                        >
                          Cập nhật
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(ticket)}
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

        {/* Pagination - Chỉ hiển thị khi có nhiều hơn 1 trang */}
        {totalPages > 1 && (
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
            <Button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              variant="outlined"
              size="small"
            >
              Trước
            </Button>
            <Typography sx={{ alignSelf: 'center' }}>
              Trang {page + 1} / {totalPages}
            </Typography>
            <Button 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              variant="outlined"
              size="small"
            >
              Sau
            </Button>
          </Stack>
        )}
      </CardContent>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Xác nhận xóa vé</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa vé "{ticketToDelete?.name}"?
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
        <Alert severity="success">Xóa vé thành công!</Alert>
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

export default ViewTickets;
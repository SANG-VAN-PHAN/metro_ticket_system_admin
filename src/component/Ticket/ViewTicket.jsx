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
  const [allTickets, setAllTickets] = useState([]); // Store all tickets
  const [tickets, setTickets] = useState([]); // Store current page tickets
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;
  
  // FILTER STATE
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
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

  useEffect(() => {
    fetchTickets();
  }, [filters]); // Remove page dependency for initial fetch

  useEffect(() => {
    // Update current page when page changes or allTickets changes
    updateCurrentPage();
  }, [page, allTickets]);

  const fetchTickets = () => {
    setLoading(true);
    
    // Kiểm tra xem có filter nào được áp dụng không
    const hasFilters = Object.values(filters).some(value => value !== '');
    
    if (hasFilters) {
      // Sử dụng API filter khi có filters - server-side pagination
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });

      // Thêm filters vào params nếu có giá trị
      if (filters.name) params.append('name', filters.name);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.ticketType) params.append('ticketType', filters.ticketType);
      if (filters.status !== '') params.append('status', filters.status);

      fetch(`https://api.metroticketingsystem.site/api/catalog/Tickets/filter?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      })
        .then(res => res.json())
        .then(data => {
          processFilteredData(data);
        })
        .catch(() => setLoading(false));
    } else {
      // Sử dụng API get all khi không có filters - client-side pagination
      fetch('https://api.metroticketingsystem.site/api/catalog/Tickets', {
        headers: { 'Accept': 'application/json' }
      })
        .then(res => res.json())
        .then(data => {
          processAllData(data);
        })
        .catch(() => setLoading(false));
    }
  };

  const processFilteredData = (data) => {
    // Server-side pagination - chỉ hiển thị kết quả từ server
    let ticketList = [];
    if (data.succeeded && data.data) {
      if (Array.isArray(data.data)) {
        ticketList = data.data;
      } else if (data.data.tickets && Array.isArray(data.data.tickets)) {
        ticketList = data.data.tickets;
      }
      
      if (data.data.totalCount) {
        setTotalPages(Math.ceil(data.data.totalCount / pageSize));
      }
    }
    
    setTickets(ticketList);
    setAllTickets([]); // Clear all tickets for filtered results
    setLoading(false);
  };

  const processAllData = (data) => {
    // Client-side pagination - lưu tất cả tickets
    let ticketList = [];
    if (data.succeeded && data.data) {
      if (Array.isArray(data.data)) {
        ticketList = data.data;
      } else if (data.data.tickets && Array.isArray(data.data.tickets)) {
        ticketList = data.data.tickets;
      }
    } else if (Array.isArray(data)) {
      ticketList = data;
    }
    
    setAllTickets(ticketList);
    setTotalPages(Math.ceil(ticketList.length / pageSize));
    setLoading(false);
  };

  const updateCurrentPage = () => {
    if (allTickets.length > 0) {
      // Client-side pagination
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const currentPageTickets = allTickets.slice(startIndex, endIndex);
      setTickets(currentPageTickets);
    }
  };

  // FILTER HANDLERS
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    setPage(0); // Reset về trang đầu
    fetchTickets();
  };

  const handleClearFilter = () => {
    setFilters({
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
      if (allTickets.length > 0) {
        // Client-side pagination
        setAllTickets(prev => prev.filter(ticket => ticket.id !== ticketToDelete.id));
      } else {
        // Server-side pagination
        setTickets(prev => prev.filter(ticket => ticket.id !== ticketToDelete.id));
      }
      
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

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Danh sách vé Metro
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
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách vé Metro
        </Typography>
        
        {/* Nút thêm vé mới và filter */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button 
            component={Link} 
            to="/ticket/create" 
            variant="contained" 
            color="primary"
          >
            Thêm vé mới
          </Button>
          <Button 
            onClick={() => setFilterOpen(!filterOpen)}
            variant="outlined"
            endIcon={<ExpandMoreIcon />}
          >
            Bộ lọc
          </Button>
        </Stack>

        {/* Filter Section */}
        <Collapse in={filterOpen}>
          <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Bộ lọc tìm kiếm
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Tên vé"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                fullWidth
                size="small"
                placeholder="Nhập tên vé cần tìm"
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
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Không hoạt động</MenuItem>
                </TextField>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Button 
                  onClick={handleApplyFilter}
                  variant="contained"
                  color="primary"
                >
                  Áp dụng bộ lọc
                </Button>
                <Button 
                  onClick={handleClearFilter}
                  variant="outlined"
                >
                  Xóa bộ lọc
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Collapse>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên vé</TableCell>
                <TableCell>Thời hạn (ngày)</TableCell>
                <TableCell>Giá (VNĐ)</TableCell>
                <TableCell>Loại vé</TableCell>
                <TableCell>Hiệu lực (ngày)</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.length === 0 ? (
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
                    <TableCell>{formatPrice(ticket.price)}</TableCell>
                    <TableCell>{ticketTypeToText(ticket.ticketType)}</TableCell>
                    <TableCell>{ticket.activeInDay}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
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
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              (Hiển thị {tickets.length} / {allTickets.length || 'N/A'} vé)
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
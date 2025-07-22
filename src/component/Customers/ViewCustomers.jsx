import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Button, Stack
} from '@mui/material';

const pageSize = 8;

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        isActive: 'true'
      });

      const res = await fetch(`https://api.metroticketingsystem.site/api/user/Customers?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.succeeded && Array.isArray(data.data)) {
        setCustomers(data.data);
      } else {
        setCustomers([]);
        setError(data.message || 'Không có dữ liệu hoặc không có quyền!');
      }
    } catch (err) {
      setError('Không thể tải danh sách khách hàng');
      setCustomers([]);
    }
    setLoading(false);
  };

  // Chỉ cho phép Ban (khóa), không có chức năng Unban
  const handleBan = async (customer) => {
    if (!customer.isActive) return; // Đã khóa thì không làm gì
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/Customers/${customer.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 204) {
        setSuccess('Đã khóa tài khoản!');
        fetchCustomers(); // Cập nhật lại danh sách
        return;
      }

      const data = await res.json();
      if (res.ok && data.succeeded) {
        setSuccess('Đã khóa tài khoản!');
        fetchCustomers(); // Cập nhật lại danh sách
      } else {
        setError(data.message || 'Thao tác thất bại');
      }
    } catch {
      setError('Thao tác thất bại');
    }
  };

  const handlePrevPage = () => setPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setPage(prev => prev + 1);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách khách hàng
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Là sinh viên</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map(customer => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.isStudent ? 'Có' : 'Không'}</TableCell>
                        <TableCell>
                          {customer.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            disabled={!customer.isActive}
                            onClick={() => handleBan(customer)}
                          >
                            Ban
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination */}
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 2 }}>
              <Button size="small" disabled={page === 0} onClick={handlePrevPage} variant="outlined">
                Trước
              </Button>
              <Typography>
                Trang {page + 1}
              </Typography>
              <Button size="small" disabled={customers.length < pageSize} onClick={handleNextPage} variant="outlined">
                Sau
              </Button>
            </Stack>
          </>
        )}
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess('')}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default ViewCustomers;
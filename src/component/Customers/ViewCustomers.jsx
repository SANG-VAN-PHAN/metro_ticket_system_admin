import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Button, Stack, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const pageSize = 8;

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, isActive]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        isActive: isActive.toString()
      });
      if (email) params.append('email', email);
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
    if (!customer.isActive) return;
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/Customers/deactivate/${customer.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 204) {
        setSuccess('Đã khóa tài khoản!');
        fetchCustomers();
        return;
      }
      const data = await res.json();
      if (res.ok && data.succeeded) {
        setSuccess('Đã khóa tài khoản!');
        fetchCustomers();
      } else {
        setError(data.message || 'Thao tác thất bại');
      }
    } catch {
      setError('Thao tác thất bại');
    }
  };

  const handleActivate = async (customer) => {
    if (customer.isActive) return;
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/Customers/activate/${customer.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 204) {
        setSuccess('Đã kích hoạt tài khoản!');
        fetchCustomers();
        return;
      }
      let data = {};
      try { data = await res.json(); } catch {}
      setError(data.message || 'Kích hoạt thất bại');
    } catch {
      setError('Kích hoạt thất bại');
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
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Tìm theo email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={() => { setPage(0); fetchCustomers(); }}
          >
            Tìm kiếm
          </Button>
          <Button
            variant={isActive ? "contained" : "outlined"}
            onClick={() => { setIsActive(true); setPage(0); fetchCustomers(); }}
          >
            Đang hoạt động
          </Button>
          <Button
            variant={!isActive ? "contained" : "outlined"}
            onClick={() => { setIsActive(false); setPage(0); fetchCustomers(); }}
          >
            Đã khoá
          </Button>
        </Stack>
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
                          {customer.isActive ? (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleBan(customer)}
                            >
                              Khoá tài khoản
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              onClick={() => handleActivate(customer)}
                            >
                              Kích hoạt
                            </Button>
                          )}
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
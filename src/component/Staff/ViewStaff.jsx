import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Button, TextField, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewStaff = () => {
  const navigate = useNavigate();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 8;

  useEffect(() => {
    fetchStaffs();
    // eslint-disable-next-line
  }, [page, email, isActive]);

  const fetchStaffs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        isActive: isActive.toString()
      });
      if (email) params.append('email', email);

      const res = await fetch(`https://api.metroticketingsystem.site/api/user/Staffs?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (data.succeeded && Array.isArray(data.data)) {
        setStaffs(data.data);
        // Nếu API trả về tổng số trang, hãy lấy ở đây. Nếu không, tự tính.
        setTotalPages(data.data.length < pageSize ? page + 1 : page + 2);
      } else {
        setStaffs([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError('Không thể tải danh sách nhân viên');
      setStaffs([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setEmail(e.target.value);
    setPage(0);
  };

  const handlePrevPage = () => setPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setPage(prev => prev + 1);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách nhân viên
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Tìm theo email"
            value={email}
            onChange={handleSearch}
            size="small"
          />
          <Button
            variant={isActive ? "contained" : "outlined"}
            onClick={() => { setIsActive(true); setPage(0); }}
          >
            Đang hoạt động
          </Button>
          <Button
            variant={!isActive ? "contained" : "outlined"}
            onClick={() => { setIsActive(false); setPage(0); }}
          >
            Đã khóa
          </Button>
           <Button
      variant="contained"
      color="success"
      onClick={() => navigate('/staff/create')}
    >
      Thêm nhân viên
    </Button>
        </Stack>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
  <TableRow>
    <TableCell>Email</TableCell>
    <TableCell>Họ tên</TableCell>
    <TableCell>Trạng thái</TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell>
    <TableCell></TableCell> {/* Thêm cột cho nút Update */}
  </TableRow>
</TableHead>
<TableBody>
  {staffs.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} align="center">
        Không có dữ liệu
      </TableCell>
    </TableRow>
  ) : (
    staffs.map(staff => (
      <TableRow key={staff.id}>
        <TableCell>{staff.email}</TableCell>
        <TableCell>{staff.name}</TableCell>
        <TableCell>
          {staff.isActive ? 'Đang hoạt động' : 'Đã khóa'}
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/staff/${staff.id}`)}
          >
            Chi tiết
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => navigate(`/staff/update/${staff.id}`)}
          >
            Cập nhật
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => {
  if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    fetch(`https://api.metroticketingsystem.site/api/user/Staffs/${staff.id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(async res => {
        if (res.status === 204) {
          fetchStaffs(); // Lấy lại danh sách mới nhất
          return;
        }
        const data = await res.json();
        if (data.succeeded) {
          fetchStaffs();
        } else {
          setError(data.message || 'Xóa thất bại');
        }
      })
      .catch(() => setError('Xóa thất bại'));
  }
}}
          >
            Xóa
          </Button>
        </TableCell> 
      </TableRow>
    ))
  )}
</TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Pagination */}
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 2 }}>
          <Button size="small" disabled={page === 0} onClick={handlePrevPage} variant="outlined">
            Trước
          </Button>
          <Typography>
            Trang {page + 1}
          </Typography>
          <Button size="small" disabled={staffs.length < pageSize} onClick={handleNextPage} variant="outlined">
            Sau
          </Button>
        </Stack>
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default ViewStaff;
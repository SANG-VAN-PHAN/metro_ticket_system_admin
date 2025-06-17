import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Button, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewBusRoutes = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchBuses = (page = 0) => {
    setLoading(true);
    fetch(`https://api.metroticketingsystem.site/api/catalog/Buses?page=${page}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setBuses(data.data.buses || []);
        setTotalPages(data.data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id) => {
  if (!window.confirm('Bạn có chắc muốn xóa tuyến này?')) return;
  try {
    const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Buses/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Lỗi khi xóa tuyến!');
    // Sau khi xóa, reload lại danh sáchs
    fetchBuses(currentPage);
  } catch (err) {
    alert('Không thể xóa tuyến. Vui lòng thử lại!');
  }
};

  useEffect(() => {
    fetchBuses(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1); // Pagination component is 1-based, API is 0-based
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách tuyến xe buýt
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/bus-routes/create')}>
            Thêm tuyến mới
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã tuyến</TableCell>
                <TableCell>Tên tuyến</TableCell>
                <TableCell>Biển số</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Station ID</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : buses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell>{bus.code}</TableCell>
                    <TableCell>{bus.destinationName}</TableCell>
                    <TableCell>{bus.licensePlates}</TableCell>
                    <TableCell>{bus.capacity}</TableCell>
                    <TableCell>{bus.status}</TableCell>
                    <TableCell>{bus.stationId}</TableCell>
                    <TableCell>
                      <Button
    variant="outlined"
    color="primary"
    onClick={() => navigate(`/bus-routes/update/${bus.id}`)}
    sx={{ mr: 1 }}
  >
    Cập nhật
  </Button>
          <IconButton color="error" onClick={() => handleDelete(bus.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ViewBusRoutes;
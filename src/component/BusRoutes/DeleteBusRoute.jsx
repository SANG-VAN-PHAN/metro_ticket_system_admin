import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteBusRoute = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchBuses = () => {
    setLoading(true);
    fetch('https://api.metroticketingsystem.site/api/catalog/Buses?currentPage=0', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setBuses(data.data.buses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleOpenDialog = (bus) => {
    setSelected(bus);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Buses/${selected.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa tuyến xe buýt!');
      setSuccess(true);
      handleCloseDialog();
      fetchBuses();
    } catch (err) {
      setError('Không thể xóa tuyến xe buýt. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Xóa tuyến xe buýt
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã tuyến</TableCell>
                <TableCell>Tên tuyến</TableCell>
                <TableCell>Biển số</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : buses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell>{bus.code}</TableCell>
                    <TableCell>{bus.destinationName}</TableCell>
                    <TableCell>{bus.licensePlates}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleOpenDialog(bus)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc muốn xóa tuyến <b>{selected?.destinationName}</b> không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Xóa tuyến xe buýt thành công!
          </Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default DeleteBusRoute;
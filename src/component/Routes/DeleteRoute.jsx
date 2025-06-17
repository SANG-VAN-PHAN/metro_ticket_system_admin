import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
const DeleteRoute = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(false);

  // Lấy danh sách tuyến từ API
  useEffect(() => {
    fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setRoutes(data.data.routes || []));
  }, []);

  const handleOpen = (route) => {
    setSelected(route);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  // Xóa tuyến qua API
  const handleDelete = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${selected.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa tuyến!');
      setRoutes(routes.filter((r) => r.id !== selected.id));
      setSuccess(true);
      handleClose();
    } catch (err) {
      alert('Không thể xóa tuyến. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Xóa tuyến Metro
        </Typography>
         <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/metro-routes')}
                  sx={{ mb: 2 }}
                >
                  Quay lại danh sách
                </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã tuyến</TableCell>
                <TableCell>Tên tuyến</TableCell>
                <TableCell>Ảnh đại diện</TableCell>
                <TableCell>Chiều dài (km)</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.code}</TableCell>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>{route.thumbnailImageUrl}</TableCell>
                  <TableCell>{route.lengthInKm}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleOpen(route)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc muốn xóa tuyến <b>{selected?.name}</b> không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Xóa tuyến thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default DeleteRoute;
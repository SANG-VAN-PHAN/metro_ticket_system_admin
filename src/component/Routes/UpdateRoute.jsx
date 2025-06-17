import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
const UpdateRoute = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    code: '',
    name: '',
    thumbnailImageUrl: '',
    lengthInKm: ''
  });

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
    setForm({
      code: route.code,
      name: route.name,
      thumbnailImageUrl: route.thumbnailImageUrl,
      lengthInKm: route.lengthInKm
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setForm({
      code: '',
      name: '',
      thumbnailImageUrl: '',
      lengthInKm: ''
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gửi cập nhật lên API
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selected) return;
    const formBody = new URLSearchParams({
      id: selected.id,
      code: form.code,
      name: form.name,
      thumbnailImageUrl: form.thumbnailImageUrl || 'empty',
      lengthInKm: form.lengthInKm
    }).toString();

    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formBody
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật tuyến!');
      // Cập nhật lại danh sách tuyến ở client
      setRoutes(routes.map((r) => (r.id === selected.id ? { ...r, ...form } : r)));
      setSuccess(true);
      handleClose();
    } catch (err) {
      alert('Không thể cập nhật tuyến. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật tuyến Metro
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
                    <IconButton color="primary" onClick={() => handleOpen(route)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Cập nhật tuyến Metro</DialogTitle>
           <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/metro-routes')}
                    sx={{ mb: 2 }}
                  >
                    Quay lại danh sách
                  </Button>
          <form onSubmit={handleUpdate}>
            <DialogContent>
              <TextField
                label="Mã tuyến"
                name="code"
                value={form.code}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Tên tuyến"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Ảnh đại diện"
                name="thumbnailImageUrl"
                value={form.thumbnailImageUrl}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="https://..."
              />
              <TextField
                label="Chiều dài (km)"
                name="lengthInKm"
                type="number"
                value={form.lengthInKm}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Hủy</Button>
              <Button type="submit" variant="contained">
                Cập nhật
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Cập nhật tuyến thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UpdateRoute;
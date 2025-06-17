import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
const UpdateStation = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    code: '',
    streetNumber: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    thumbnailImageUrl: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchStations = () => {
    setLoading(true);
    fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setStations(data.data.stations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleOpen = (station) => {
    setSelected(station);
    setForm({
      id: station.id,
      name: station.name,
      code: station.code,
      streetNumber: station.streetNumber || '',
      street: station.street || '',
      ward: station.ward || '',
      district: station.district || '',
      city: station.city || '',
      thumbnailImageUrl: station.thumbnailImageUrl === 'empty' ? '' : (station.thumbnailImageUrl || '')
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setForm({
      id: '',
      name: '',
      code: '',
      streetNumber: '',
      street: '',
      ward: '',
      district: '',
      city: '',
      thumbnailImageUrl: ''
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        id: form.id,
        name: form.name,
        code: form.code,
        streetNumber: form.streetNumber,
        street: form.street,
        ward: form.ward,
        district: form.district,
        city: form.city,
        thumbnailImageUrl: form.thumbnailImageUrl || 'empty'
      }).toString()
    });
    if (!res.ok) {
      const errMsg = await res.text();
      setError('Không thể cập nhật ga. ' + errMsg);
      return;
    }
    setSuccess(true);
    handleClose();
    fetchStations();
  } catch (err) {
    setError('Không thể cập nhật ga. Vui lòng thử lại!');
  }
};

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật thông tin ga Metro
        </Typography>
        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate('/stations')}
                          sx={{ mb: 2 }}
                        >
                          Quay lại danh sách
                        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã ga</TableCell>
                <TableCell>Tên ga</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : stations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                stations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.code}</TableCell>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>
                      {[station.streetNumber, station.street, station.ward, station.district, station.city]
                        .filter(Boolean)
                        .join(', ') || 'Chưa cập nhật'}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(station)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Cập nhật ga Metro</DialogTitle>
          <form onSubmit={handleUpdate}>
            <DialogContent>
              <TextField
                label="Tên ga"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Mã ga"
                name="code"
                value={form.code}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Số nhà"
                name="streetNumber"
                value={form.streetNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Tên đường"
                name="street"
                value={form.street}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phường"
                name="ward"
                value={form.ward}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Quận"
                name="district"
                value={form.district}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Thành phố"
                name="city"
                value={form.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ảnh đại diện (URL)"
                name="thumbnailImageUrl"
                value={form.thumbnailImageUrl}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="https://..."
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
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Cập nhật ga thành công!
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

export default UpdateStation;
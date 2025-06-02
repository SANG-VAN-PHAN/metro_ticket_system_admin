import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const initialStations = [
  { id: 1, name: 'Bến Thành', line: 'Tuyến số 1', location: 'Quận 1', status: 'Đang hoạt động' },
  { id: 2, name: 'Suối Tiên', line: 'Tuyến số 1', location: 'Thủ Đức', status: 'Đang hoạt động' },
  { id: 3, name: 'Tham Lương', line: 'Tuyến số 2', location: 'Quận 12', status: 'Đang xây dựng' }
];

const UpdateStation = () => {
  const [stations, setStations] = useState(initialStations);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '',
    line: '',
    location: '',
    status: 'Đang hoạt động'
  });

  const handleOpen = (station) => {
    setSelected(station);
    setForm(station);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setForm({
      name: '',
      line: '',
      location: '',
      status: 'Đang hoạt động'
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setStations(stations.map((s) => (s.id === selected.id ? { ...form, id: selected.id } : s)));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật thông tin ga Metro
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên ga</TableCell>
                <TableCell>Tuyến</TableCell>
                <TableCell>Vị trí</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell>{station.name}</TableCell>
                  <TableCell>{station.line}</TableCell>
                  <TableCell>{station.location}</TableCell>
                  <TableCell>{station.status}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(station)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
                label="Tuyến"
                name="line"
                value={form.line}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Vị trí"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                select
                label="Trạng thái"
                name="status"
                value={form.status}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
                <MenuItem value="Đang xây dựng">Đang xây dựng</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Hủy</Button>
              <Button type="submit" variant="contained">
                Cập nhật
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UpdateStation;
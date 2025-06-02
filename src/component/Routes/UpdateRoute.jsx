import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const initialRoutes = [
  { id: 1, routeName: 'Tuyến số 1', start: 'Bến Thành', end: 'Suối Tiên', stations: 14, status: 'Đang hoạt động' },
  { id: 2, routeName: 'Tuyến số 2', start: 'Bến Thành', end: 'Tham Lương', stations: 11, status: 'Đang xây dựng' },
  { id: 3, routeName: 'Tuyến số 3A', start: 'Bến Thành', end: 'Bến xe Miền Tây', stations: 10, status: 'Đang quy hoạch' }
];

const UpdateRoute = () => {
  const [routes, setRoutes] = useState(initialRoutes);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    routeName: '',
    start: '',
    end: '',
    stations: '',
    status: 'Đang hoạt động'
  });

  const handleOpen = (route) => {
    setSelected(route);
    setForm(route);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setForm({
      routeName: '',
      start: '',
      end: '',
      stations: '',
      status: 'Đang hoạt động'
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setRoutes(routes.map((r) => (r.id === selected.id ? { ...form, id: selected.id } : r)));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật tuyến Metro
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên tuyến</TableCell>
                <TableCell>Điểm đầu</TableCell>
                <TableCell>Điểm cuối</TableCell>
                <TableCell>Số ga</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.routeName}</TableCell>
                  <TableCell>{route.start}</TableCell>
                  <TableCell>{route.end}</TableCell>
                  <TableCell>{route.stations}</TableCell>
                  <TableCell>{route.status}</TableCell>
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
          <form onSubmit={handleUpdate}>
            <DialogContent>
              <TextField
                label="Tên tuyến"
                name="routeName"
                value={form.routeName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Điểm đầu"
                name="start"
                value={form.start}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Điểm cuối"
                name="end"
                value={form.end}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Số ga"
                name="stations"
                type="number"
                value={form.stations}
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
                <MenuItem value="Đang quy hoạch">Đang quy hoạch</MenuItem>
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

export default UpdateRoute;
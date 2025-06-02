import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const initialRoutes = [
  { id: 1, routeName: 'Tuyến số 1', start: 'Bến Thành', end: 'Suối Tiên', stations: 14, status: 'Đang hoạt động' },
  { id: 2, routeName: 'Tuyến số 2', start: 'Bến Thành', end: 'Tham Lương', stations: 11, status: 'Đang xây dựng' },
  { id: 3, routeName: 'Tuyến số 3A', start: 'Bến Thành', end: 'Bến xe Miền Tây', stations: 10, status: 'Đang quy hoạch' }
];

const DeleteRoute = () => {
  const [routes, setRoutes] = useState(initialRoutes);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (route) => {
    setSelected(route);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = () => {
    setRoutes(routes.filter((r) => r.id !== selected.id));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Xóa tuyến Metro
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
            Bạn có chắc muốn xóa tuyến <b>{selected?.routeName}</b> không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DeleteRoute;
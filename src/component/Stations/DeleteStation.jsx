import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const initialStations = [
  { id: 1, name: 'Bến Thành', line: 'Tuyến số 1', location: 'Quận 1', status: 'Đang hoạt động' },
  { id: 2, name: 'Suối Tiên', line: 'Tuyến số 1', location: 'Thủ Đức', status: 'Đang hoạt động' },
  { id: 3, name: 'Tham Lương', line: 'Tuyến số 2', location: 'Quận 12', status: 'Đang xây dựng' }
];

const DeleteStation = () => {
  const [stations, setStations] = useState(initialStations);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (station) => {
    setSelected(station);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = () => {
    setStations(stations.filter((s) => s.id !== selected.id));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Xóa ga Metro
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
                    <IconButton color="error" onClick={() => handleOpen(station)}>
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
            Bạn có chắc muốn xóa ga <b>{selected?.name}</b> không?
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

export default DeleteStation;
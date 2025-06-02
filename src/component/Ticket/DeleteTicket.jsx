import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const initialTickets = [
  { id: 1, code: 'TKT001', route: 'Tuyến số 1', customer: 'Nguyễn Văn A', price: 15000, status: 'Đã sử dụng' },
  { id: 2, code: 'TKT002', route: 'Tuyến số 2', customer: 'Trần Thị B', price: 20000, status: 'Chưa sử dụng' },
  { id: 3, code: 'TKT003', route: 'Tuyến số 1', customer: 'Lê Văn C', price: 15000, status: 'Đã hủy' }
];

const DeleteTicket = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (ticket) => {
    setSelected(ticket);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = () => {
    setTickets(tickets.filter((t) => t.id !== selected.id));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Xóa vé
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã vé</TableCell>
                <TableCell>Tuyến</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Giá vé</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.code}</TableCell>
                  <TableCell>{ticket.route}</TableCell>
                  <TableCell>{ticket.customer}</TableCell>
                  <TableCell>{ticket.price.toLocaleString()} đ</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleOpen(ticket)}>
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
            Bạn có chắc muốn xóa vé <b>{selected?.code}</b> không?
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

export default DeleteTicket;
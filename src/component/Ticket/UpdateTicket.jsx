import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const initialTickets = [
  { id: 1, code: 'TKT001', route: 'Tuyến số 1', customer: 'Nguyễn Văn A', price: 15000, status: 'Đã sử dụng' },
  { id: 2, code: 'TKT002', route: 'Tuyến số 2', customer: 'Trần Thị B', price: 20000, status: 'Chưa sử dụng' },
  { id: 3, code: 'TKT003', route: 'Tuyến số 1', customer: 'Lê Văn C', price: 15000, status: 'Đã hủy' }
];

const UpdateTicket = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    code: '',
    route: '',
    customer: '',
    price: '',
    status: 'Chưa sử dụng'
  });

  const handleOpen = (ticket) => {
    setSelected(ticket);
    setForm(ticket);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setForm({
      code: '',
      route: '',
      customer: '',
      price: '',
      status: 'Chưa sử dụng'
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setTickets(tickets.map((t) => (t.id === selected.id ? { ...form, id: selected.id } : t)));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật vé
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
                    <IconButton color="primary" onClick={() => handleOpen(ticket)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Cập nhật vé</DialogTitle>
          <form onSubmit={handleUpdate}>
            <DialogContent>
              <TextField
                label="Mã vé"
                name="code"
                value={form.code}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Tuyến"
                name="route"
                value={form.route}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Khách hàng"
                name="customer"
                value={form.customer}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Giá vé"
                name="price"
                type="number"
                value={form.price}
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
                <MenuItem value="Chưa sử dụng">Chưa sử dụng</MenuItem>
                <MenuItem value="Đã sử dụng">Đã sử dụng</MenuItem>
                <MenuItem value="Đã hủy">Đã hủy</MenuItem>
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

export default UpdateTicket;
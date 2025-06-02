import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, MenuItem, Snackbar, Alert } from '@mui/material';

const CreateTicket = () => {
  const [form, setForm] = useState({
    code: '',
    route: '',
    customer: '',
    price: '',
    status: 'Chưa sử dụng'
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi dữ liệu lên API hoặc lưu local tại đây
    setOpen(true);
    setForm({
      code: '',
      route: '',
      customer: '',
      price: '',
      status: 'Chưa sử dụng'
    });
  };

  const handleClose = () => setOpen(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm vé mới
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm vé
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm vé thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateTicket;
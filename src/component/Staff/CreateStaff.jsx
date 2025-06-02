import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, MenuItem, Snackbar, Alert } from '@mui/material';

const CreateStaff = () => {
  const [form, setForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    status: 'Đang làm việc'
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
      name: '',
      position: '',
      email: '',
      phone: '',
      status: 'Đang làm việc'
    });
  };

  const handleClose = () => setOpen(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm nhân viên mới
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Họ và tên"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Chức vụ"
            name="position"
            value={form.position}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={form.phone}
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
            <MenuItem value="Đang làm việc">Đang làm việc</MenuItem>
            <MenuItem value="Đã nghỉ việc">Đã nghỉ việc</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm nhân viên
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm nhân viên thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateStaff;
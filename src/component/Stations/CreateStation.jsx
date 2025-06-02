import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, MenuItem, Snackbar, Alert } from '@mui/material';

const CreateStation = () => {
  const [form, setForm] = useState({
    name: '',
    line: '',
    location: '',
    status: 'Đang hoạt động'
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
      line: '',
      location: '',
      status: 'Đang hoạt động'
    });
  };

  const handleClose = () => setOpen(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm ga Metro mới
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm ga
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm ga thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateStation;
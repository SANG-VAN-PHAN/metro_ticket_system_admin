import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, MenuItem, Snackbar, Alert } from '@mui/material';

const CreateRoute = () => {
  const [form, setForm] = useState({
    routeName: '',
    start: '',
    end: '',
    stations: '',
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
      routeName: '',
      start: '',
      end: '',
      stations: '',
      status: 'Đang hoạt động'
    });
  };

  const handleClose = () => setOpen(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm tuyến Metro mới
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm tuyến
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm tuyến thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateRoute;
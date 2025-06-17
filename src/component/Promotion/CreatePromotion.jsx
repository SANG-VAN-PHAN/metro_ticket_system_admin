import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert, MenuItem } from '@mui/material';

const CreatePromotion = () => {
  const [form, setForm] = useState({
    code: '',
    description: '',
    discount: '',
    type: 'Phần trăm',
    status: 'Đang áp dụng'
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
      description: '',
      discount: '',
      type: 'Phần trăm',
      status: 'Đang áp dụng'
    });
  };

  const handleClose = () => setOpen(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm khuyến mãi mới
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Mã khuyến mãi"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mô tả"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Giá trị giảm"
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Loại giảm"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Phần trăm">Phần trăm (%)</MenuItem>
            <MenuItem value="Tiền mặt">Tiền mặt (VNĐ)</MenuItem>
          </TextField>
          <TextField
            select
            label="Trạng thái"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Đang áp dụng">Đang áp dụng</MenuItem>
            <MenuItem value="Ngừng áp dụng">Ngừng áp dụng</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm khuyến mãi
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm khuyến mãi thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreatePromotion;
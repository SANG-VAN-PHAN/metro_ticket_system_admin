import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const CreateRoute = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: '',
    name: '',
    thumbnailImageUrl: '',
    lengthInKm: ''
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  if (!form.code || !form.name || !form.lengthInKm) {
    setError('Vui lòng nhập đầy đủ thông tin bắt buộc!');
    return;
  }

  // Tạo body dạng x-www-form-urlencoded
  const formBody = new URLSearchParams({
    id: uuidv4(),
    code: form.code,
    name: form.name,
    thumbnailImageUrl: form.thumbnailImageUrl || 'empty',
    lengthInKm: form.lengthInKm
  }).toString();

  try {
    const res = await fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formBody
    });
    if (!res.ok) throw new Error('Lỗi khi thêm tuyến!');
    setOpen(true);
    setForm({
      code: '',
      name: '',
      thumbnailImageUrl: '',
      lengthInKm: ''
    });
  } catch (err) {
    setError('Không thể thêm tuyến. Vui lòng thử lại!');
  }
};

  const handleClose = () => setOpen(false);

  return (
    <Card>
      <CardContent>
        
        <Typography variant="h4" gutterBottom>
          Thêm tuyến Metro mới
        </Typography>
         <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/metro-routes')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Mã tuyến (Code)"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Tên tuyến (Name)"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Ảnh đại diện (ThumbnailImageUrl)"
            name="thumbnailImageUrl"
            value={form.thumbnailImageUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="https://..."
          />
          <TextField
            label="Chiều dài (km)"
            name="lengthInKm"
            type="number"
            value={form.lengthInKm}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm tuyến
          </Button>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
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
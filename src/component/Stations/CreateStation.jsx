import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const CreateStation = () => {
  const [form, setForm] = useState({
    name: '',
    code: '',
    streetNumber: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    thumbnailImageUrl: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          id: uuidv4(),
          name: form.name,
          code: form.code,
          streetNumber: form.streetNumber,
          street: form.street,
          ward: form.ward,
          district: form.district,
          city: form.city,
          thumbnailImageUrl: form.thumbnailImageUrl || 'empty'
        }).toString()
      });
      if (!res.ok) throw new Error('Lỗi khi tạo nhà ga!');
      setSuccess(true);
      setTimeout(() => navigate('/stations'), 1500);
    } catch (err) {
      setError('Không thể tạo nhà ga. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm nhà ga mới
        </Typography>
         <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/stations')}
                  sx={{ mb: 2 }}
                >
                  Quay lại danh sách
                </Button>
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
            label="Mã ga"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Đường số"
            name="streetNumber"
            value={form.streetNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên đường"
            name="street"
            value={form.street}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phường"
            name="ward"
            value={form.ward}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quận"
            name="district"
            value={form.district}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Thành phố"
            name="city"
            value={form.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ảnh đại diện (URL)"
            name="thumbnailImageUrl"
            value={form.thumbnailImageUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="https://..."
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm nhà ga
          </Button>
        </form>
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Thêm nhà ga thành công!
          </Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateStation;
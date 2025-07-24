import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreatePriceRange = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fromKm: '',
    toKm: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/PriceRanges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fromKm: parseFloat(form.fromKm),
          toKm: parseFloat(form.toKm),
          price: parseFloat(form.price)
        })
      });
      const data = await res.json();
      if (!res.ok || (data && data.succeeded === false)) {
        throw new Error(data && data.message ? data.message : 'Không thể tạo khoảng giá vé!');
      }
      setSuccess(true);
      setTimeout(() => navigate('/price-ranges'), 1500);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm khoảng giá vé mới
        </Typography>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/price-ranges')} sx={{ mb: 2 }}>
          Quay lại danh sách
        </Button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Từ (km)"
            name="fromKm"
            type="number"
            value={form.fromKm}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            label="Đến (km)"
            name="toKm"
            type="number"
            value={form.toKm}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            label="Giá vé (VNĐ) / km"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 1 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Đang tạo...' : 'Thêm khoảng giá'}
          </Button>
        </form>
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Thêm khoảng giá vé thành công!
          </Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreatePriceRange; 
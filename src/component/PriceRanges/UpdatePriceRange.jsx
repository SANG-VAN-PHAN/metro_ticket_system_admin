import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePriceRange = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    fromKm: '',
    toKm: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPriceRange();
    // eslint-disable-next-line
  }, [id]);

  const fetchPriceRange = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/PriceRanges/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && (data.succeeded && data.data || data.id)) {
        const pr = data.data || data;
        setForm({
          id: pr.id,
          fromKm: pr.fromKm || '',
          toKm: pr.toKm || '',
          price: pr.price || ''
        });
      } else {
        setError('Không tìm thấy khoảng giá!');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/PriceRanges', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: form.id,
          fromKm: parseFloat(form.fromKm),
          toKm: parseFloat(form.toKm),
          price: parseFloat(form.price)
        })
      });
      const data = await res.json();
      if (!res.ok || (data && data.succeeded === false)) {
        throw new Error(data && data.message ? data.message : 'Không thể cập nhật khoảng giá!');
      }
      setSuccess(true);
      setTimeout(() => navigate('/price-ranges'), 1500);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra!');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Cập nhật khoảng giá vé
          </Typography>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật khoảng giá vé
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={updating}>
            {updating ? 'Đang cập nhật...' : 'Cập nhật khoảng giá'}
          </Button>
        </form>
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Cập nhật khoảng giá vé thành công!
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

export default UpdatePriceRange; 
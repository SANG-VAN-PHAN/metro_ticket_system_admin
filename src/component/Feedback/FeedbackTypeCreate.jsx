import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FeedbackTypeCreate = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/user/FeedbackTypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: form.name, description: form.description })
      });
      const data = await res.json();
      if (res.ok && data.succeeded) {
        setSuccess('Tạo mới thành công!');
        setTimeout(() => navigate('/feedback-types'), 1200);
      } else {
        setError(data.message || 'Tạo mới thất bại');
      }
    } catch {
      setError('Tạo mới thất bại');
    }
    setLoading(false);
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
      <CardContent>
        <Typography variant="h5" mb={2}>Thêm loại Feedback</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tên loại"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Mô tả"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              Tạo mới
            </Button>
          </Stack>
        </form>
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}><Alert severity="error">{error}</Alert></Snackbar>
        <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess('')}><Alert severity="success">{success}</Alert></Snackbar>
      </CardContent>
    </Card>
  );
};

export default FeedbackTypeCreate; 
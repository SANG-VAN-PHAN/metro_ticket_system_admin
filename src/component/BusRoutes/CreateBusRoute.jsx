import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateBusRoute = () => {
  const [form, setForm] = useState({
    stationId: '',
    destinationName: ''
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
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          stationId: form.stationId,
          destinationName: form.destinationName
        })
      });
      if (!res.ok) throw new Error('Lỗi khi tạo tuyến xe buýt!');
      setSuccess(true);
      setTimeout(() => navigate('/bus-routes'), 1500);
    } catch (err) {
      setError('Không thể tạo tuyến xe buýt. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm tuyến xe buýt mới
        </Typography>
        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate('/bus-routes')}
                          sx={{ mb: 2 }}
                        >
                          Quay lại danh sách
                        </Button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Station ID"
            name="stationId"
            value={form.stationId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Tên tuyến"
            name="destinationName"
            value={form.destinationName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm tuyến xe buýt
          </Button>
        </form>
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Thêm tuyến xe buýt thành công!
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

export default CreateBusRoute;
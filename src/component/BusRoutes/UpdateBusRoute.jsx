import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBusRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    stationId: '',
    destinationName: ''
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://api.metroticketingsystem.site/api/catalog/Buses?currentPage=0', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        const bus = (data.data.buses || []).find(b => b.id === id);
        if (bus) {
          setForm({
            id: bus.id,
            stationId: bus.stationId || '',
            destinationName: bus.destinationName || ''
          });
        } else {
          setError('Không tìm thấy tuyến xe buýt!');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Lỗi khi tải dữ liệu!');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Buses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: form.id,
          stationId: form.stationId,
          destinationName: form.destinationName
        })
      });
      if (!res.ok) {
        const errMsg = await res.text();
        setError('Không thể cập nhật tuyến xe buýt. ' + errMsg);
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/bus-routes'), 1500);
    } catch (err) {
      setError('Không thể cập nhật tuyến xe buýt. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật tuyến xe buýt
        </Typography>
        <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => navigate('/bus-routes')}
                                  sx={{ mb: 2 }}
                                >
                                  Quay lại danh sách
                                </Button>
        {loading ? (
          <Typography>Đang tải...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <form onSubmit={handleUpdate}>
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
              Cập nhật
            </Button>
          </form>
        )}
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Cập nhật tuyến xe buýt thành công!
          </Alert>
        </Snackbar>
        <Snackbar open={!!error && !loading} autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UpdateBusRoute;
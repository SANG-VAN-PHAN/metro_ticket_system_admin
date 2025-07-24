import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, MenuItem, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    activeInDay: '',
    expirationInDay: '',
    ticketType: 1
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
      const response = await fetch('https://api.metroticketingsystem.site/api/catalog/Tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          price: parseInt(form.ticketType) === 1 ? 0 : parseFloat(form.price),
          activeInDay: parseInt(form.activeInDay),
          expirationInDay: parseInt(form.expirationInDay),
          ticketType: parseInt(form.ticketType)
        })
      });

      if (!response.ok) {
        throw new Error('Không thể tạo vé. Vui lòng thử lại!');
      }

      setSuccess(true);
      setForm({
        name: '',
        price: '',
        activeInDay: '',
        expirationInDay: '',
        ticketType: 1
      });

      // Chuyển về trang danh sách sau 2 giây
      setTimeout(() => {
        navigate('/ticket');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm vé mới
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/ticket')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên vé"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            placeholder="Ví dụ: Vé 1 ngày, Vé 3 ngày..."
          />
          
          <TextField
            label={parseInt(form.ticketType) === 1 ? 'Giá vé lượt sẽ được tính theo khoảng cách giữa 2 ga' : 'Giá vé (VNĐ)'}
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={parseInt(form.ticketType) !== 1}
            disabled={parseInt(form.ticketType) === 1}
            inputProps={{ min: 0, step: 0.01 }}
            placeholder={parseInt(form.ticketType) === 1 ? 'Giá vé sẽ thay đổi dựa trên khoảng cách' : 'Ví dụ: 20000'}
          />
          
          <TextField
            label="Tự động kích hoạt trong (ngày)"
            name="activeInDay"
            type="number"
            value={form.activeInDay}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1 }}
            placeholder="Số ngày vé có hiệu lực"
          />
          
          <TextField
            label="Hết hạn trong (ngày)"
            name="expirationInDay"
            type="number"
            value={form.expirationInDay}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1 }}
            placeholder="Số ngày tối đa có thể sử dụng"
          />
          
          <TextField
            select
            label="Loại vé"
            name="ticketType"
            value={form.ticketType}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value={1}>Vé lượt</MenuItem>
            <MenuItem value={2}>Vé ngày</MenuItem>
            <MenuItem value={3}>Vé học sinh sinh viên</MenuItem>
          </TextField>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Thêm vé'}
          </Button>
        </form>
        
        <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm vé thành công! Đang chuyển về danh sách...
          </Alert>
        </Snackbar>
        
        <Snackbar open={!!error} autoHideDuration={4000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateTicket;
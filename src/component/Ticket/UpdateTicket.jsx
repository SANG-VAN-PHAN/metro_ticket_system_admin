import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, MenuItem, 
  Snackbar, Alert, CircularProgress 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    activeInDay: '',
    expirationInDay: '',
    ticketType: 1
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await fetch('https://api.metroticketingsystem.site/api/catalog/Tickets', {
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      
      // Tìm ticket theo ID
      let tickets = [];
      if (data.succeeded && data.data) {
        if (Array.isArray(data.data)) {
          tickets = data.data;
        } else if (data.data.tickets && Array.isArray(data.data.tickets)) {
          tickets = data.data.tickets;
        }
      } else if (Array.isArray(data)) {
        tickets = data;
      }

      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        setForm({
          id: ticket.id,
          name: ticket.name || '',
          price: ticket.price || '',
          activeInDay: ticket.activeInDay || '',
          expirationInDay: ticket.expirationInDay || '',
          ticketType: ticket.ticketType || 1
        });
      } else {
        setError('Không tìm thấy vé!');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu vé!');
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
      const response = await fetch('https://api.metroticketingsystem.site/api/catalog/Tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: form.id,
          name: form.name,
          price: parseFloat(form.price),
          activeInDay: parseInt(form.activeInDay),
          expirationInDay: parseInt(form.expirationInDay),
          ticketType: parseInt(form.ticketType)
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật vé. Vui lòng thử lại!');
      }

      setSuccess(true);
      
      // Chuyển về trang danh sách sau 2 giây
      setTimeout(() => {
        navigate('/ticket');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Cập nhật vé
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
          Cập nhật vé
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
            label="Giá vé (VNĐ)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
            placeholder="Ví dụ: 20000"
          />
          
          <TextField
            label="Thời gian hiệu lực (ngày)"
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
            label="Thời hạn sử dụng (ngày)"
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
            disabled={updating}
          >
            {updating ? 'Đang cập nhật...' : 'Cập nhật vé'}
          </Button>
        </form>
        
        <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Cập nhật vé thành công! Đang chuyển về danh sách...
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

export default UpdateTicket;
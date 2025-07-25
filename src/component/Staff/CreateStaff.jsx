import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Snackbar, Alert, CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateStaff = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api.metroticketingsystem.site/api/user/Auth/staff/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName
        })
      });

      // Xử lý lỗi trả về từ API (dạng JSON hoặc text)
      if (!response.ok) {
        let errorMsg = 'Không thể tạo tài khoản nhân viên';
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) errorMsg = errorData.message;
        } catch {
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setSuccess(true);

      setForm({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      });

      setTimeout(() => {
        navigate('/staff');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tạo tài khoản nhân viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm nhân viên mới
        </Typography>
        
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/staff')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Họ"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            label="Tên"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            placeholder="example@company.com"
          />
          
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            placeholder="Ít nhất 6 ký tự"
            inputProps={{ minLength: 6 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Đang tạo tài khoản...
              </>
            ) : (
              'Thêm nhân viên'
            )}
          </Button>
        </form>
        
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Tạo tài khoản nhân viên thành công!
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

export default CreateStaff;
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch staff info by id
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://api.metroticketingsystem.site/api/user/Staffs/${id}`, {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (data.succeeded && data.data) {
          // Tách họ tên nếu cần
          const nameArr = (data.data.name || '').split(' ');
          setForm({
            firstName: nameArr[0] || '',
            lastName: nameArr.slice(1).join(' ') || '',
            email: data.data.email || ''
          });
        } else {
          setError('Không tìm thấy nhân viên!');
        }
      } catch {
        setError('Lỗi khi tải dữ liệu nhân viên!');
      }
      setLoading(false);
    };
    if (id) fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/Staffs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email
        })
      });
      const data = await res.json();
      if (res.ok && data.succeeded !== false) {
        setSuccess(true);
        setTimeout(() => navigate('/staff'), 1500);
      } else {
        setError(data.message || 'Cập nhật thất bại');
      }
    } catch {
      setError('Cập nhật thất bại');
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">Cập nhật nhân viên</Typography>
          <CircularProgress sx={{ mt: 3 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật thông tin nhân viên
        </Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            label="Họ"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={updating}
          />
          <TextField
            label="Tên"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={updating}
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
            disabled={updating}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={updating}
          >
            {updating ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate('/staff')}
            disabled={updating}
          >
            Quay lại danh sách
          </Button>
        </form>
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success">Cập nhật thành công!</Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UpdateStaff;
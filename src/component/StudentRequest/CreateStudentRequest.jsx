import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Alert, Grid, Paper, Avatar
} from '@mui/material';

const CreateStudentRequest = () => {
  const [form, setForm] = useState({
    studentCode: '',
    studentEmail: '',
    schoolName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    studentCardImage: null // Lưu file ảnh thật
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  // Lưu file ảnh thật vào state
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm({ ...form, studentCardImage: file });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    // Validate required fields
    if (
      !form.studentCode ||
      !form.studentEmail ||
      !form.schoolName ||
      !form.firstName ||
      !form.lastName ||
      !form.dateOfBirth
    ) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (!form.studentCardImage) {
      setError('Vui lòng upload ảnh thẻ sinh viên!');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('studentCode', form.studentCode);
      formData.append('studentEmail', form.studentEmail);
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('dateOfBirth', form.dateOfBirth);
      formData.append('studentCardImage', form.studentCardImage); // file
      formData.append('schoolName', form.schoolName);

      const res = await fetch('https://api.metroticketingsystem.site/api/user/StudentRequest', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Gửi yêu cầu xác thực thành công!');
        setForm({
          studentCode: '',
          studentEmail: '',
          schoolName: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          studentCardImage: null
        });
        setPreview('');
      } else {
        setError(data.message || 'Gửi yêu cầu thất bại!');
      }
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gửi yêu cầu xác thực sinh viên
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Mã sinh viên"
            name="studentCode"
            fullWidth
            margin="normal"
            value={form.studentCode}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email sinh viên"
            name="studentEmail"
            fullWidth
            margin="normal"
            value={form.studentEmail}
            onChange={handleChange}
            required
          />
          <TextField
            label="Trường"
            name="schoolName"
            fullWidth
            margin="normal"
            value={form.schoolName}
            onChange={handleChange}
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Họ"
                name="lastName"
                fullWidth
                margin="normal"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tên"
                name="firstName"
                fullWidth
                margin="normal"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <TextField
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            fullWidth
            margin="normal"
            value={form.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Box mt={2} mb={2}>
            <Button variant="contained" component="label">
              Upload ảnh thẻ sinh viên
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {preview && (
              <Avatar
                src={preview}
                alt="student-card"
                variant="rounded"
                sx={{ width: 80, height: 80, ml: 2, display: 'inline-block' }}
              />
            )}
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Gửi yêu cầu
          </Button>
        </form>
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default CreateStudentRequest;
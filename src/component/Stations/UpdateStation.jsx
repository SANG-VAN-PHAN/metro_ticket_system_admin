import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Card, CardContent, Typography, TextField, Button,
  Stack, CircularProgress, Box, Snackbar, Alert, Avatar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// helper format address
const formatAddress = ({ streetNumber, street, ward, district, city }) =>
  [streetNumber, street, ward, district, city].filter(Boolean).join(', ');

const UpdateStation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: '', name: '', streetNumber: '',
    street: '', ward: '', district: '', city: '',
    thumbnailImageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // fetch single station
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations/${id}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.succeeded || !json.data) throw new Error('Không tìm thấy trạm');
        const s = json.data;
        setForm({
          code: s.code,
          name: s.name,
          streetNumber: s.streetNumber || '',
          street: s.street || '',
          ward: s.ward || '',
          district: s.district || '',
          city: s.city || '',
          thumbnailImageUrl: s.thumbnailImageUrl === 'empty' ? '' : s.thumbnailImageUrl
        });
        setImagePreview(s.thumbnailImageUrl === 'empty' ? '' : s.thumbnailImageUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('code', form.code);
      formData.append('name', form.name);
      formData.append('streetNumber', form.streetNumber);
      formData.append('street', form.street);
      formData.append('ward', form.ward);
      formData.append('district', form.district);
      formData.append('city', form.city);
      
      if (imageFile) {
        formData.append('ThumbnailImage', imageFile);
      } else {
        formData.append('thumbnailImageUrl', form.thumbnailImageUrl || 'empty');
      }

      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
      
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || res.statusText);
      }
      setSuccess(true);
      setTimeout(() => navigate('/stations'), 1000);
    } catch (err) {
      setError('Cập nhật thất bại: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật ga Metro
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Mã ga" name="code" value={form.code}
              onChange={handleChange} required fullWidth
            />
            <TextField
              label="Tên ga" name="name" value={form.name}
              onChange={handleChange} required fullWidth
            />
            <TextField
              label="Số nhà" name="streetNumber"
              value={form.streetNumber} onChange={handleChange} fullWidth
            />
            <TextField
              label="Đường" name="street"
              value={form.street} onChange={handleChange} fullWidth
            />
            <TextField
              label="Phường" name="ward"
              value={form.ward} onChange={handleChange} fullWidth
            />
            <TextField
              label="Quận" name="district"
              value={form.district} onChange={handleChange} fullWidth
            />
            <TextField
              label="Thành phố" name="city"
              value={form.city} onChange={handleChange} fullWidth
            />
            
            {/* Upload ảnh */}
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Chọn ảnh ga
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box mt={2} textAlign="center">
                  <Avatar
                    src={imagePreview}
                    alt="Preview"
                    sx={{ width: 120, height: 120, mx: 'auto' }}
                    variant="rounded"
                  />
                </Box>
              )}
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Địa chỉ đầy đủ: {formatAddress(form)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
              <Button component={Link} to="/stations">
                Hủy
              </Button>
            </Stack>
          </Stack>
        </form>
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError('')}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success">Cập nhật thành công!</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UpdateStation;
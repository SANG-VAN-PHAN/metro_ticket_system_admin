import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, CircularProgress, Alert, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const DetailStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          setStaff(data.data);
        } else {
          setError('Không tìm thấy nhân viên!');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu nhân viên!');
      }
      setLoading(false);
    };
    if (id) fetchStaff();
  }, [id]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">Chi tiết nhân viên</Typography>
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5">Chi tiết nhân viên</Typography>
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/staff')}>
            Quay lại danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Chi tiết nhân viên
        </Typography>
        <Typography><b>ID:</b> {staff.id}</Typography>
        <Typography><b>Họ tên:</b> {staff.name}</Typography>
        <Typography><b>Email:</b> {staff.email}</Typography>
        <Typography>
          <b>Trạng thái:</b> {staff.isActive ? 'Đang hoạt động' : 'Đã khóa'}
        </Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/staff')}>
          Quay lại danh sách
        </Button>
      </CardContent>
    </Card>
  );
};

export default DetailStaff;
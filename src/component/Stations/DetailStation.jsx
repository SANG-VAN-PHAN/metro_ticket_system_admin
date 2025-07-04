import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card, CardContent, Typography, Stack, Button, Avatar, CircularProgress, Box
} from '@mui/material';

const formatAddress = ({ streetNumber, street, ward, district, city }) =>
  [streetNumber, street, ward, district, city].filter(Boolean).join(', ');

const DetailStation = () => {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.metroticketingsystem.site/api/catalog/Stations/${id}`,
          { headers: { 'Accept': 'application/json' } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.succeeded || !json.data) throw new Error('Không tìm thấy trạm');
        setStation(json.data);
      } catch (err) {
        setError(err.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [id]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Chi tiết trạm Metro
        </Typography>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Typography>
            <strong>Mã ga:</strong> {station.code}
          </Typography>
          <Typography>
            <strong>Tên ga:</strong> {station.name}
          </Typography>
          <Typography>
            <strong>Địa chỉ:</strong> {formatAddress(station)}
          </Typography>
          <Avatar
            src={station.thumbnailImageUrl}
            alt={station.name}
            sx={{ width: 120, height: 120 }}
            variant="rounded"
          />
          <Typography variant="caption" color="text.secondary">
            Tạo: {new Date(station.createdAt).toLocaleString()}
          </Typography>
        </Stack>
        <Button component={Link} to="/stations" variant="outlined">
          Quay lại danh sách
        </Button>
      </CardContent>
    </Card>
  );
};

export default DetailStation;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card, CardContent, Typography, Stack, Button, CircularProgress
} from '@mui/material';

// Hàm format số tiền với 2 số sau dấu phẩy
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0.00';
  return Number(value).toFixed(2);
};

// Hàm chuyển đổi loại vé thành chữ
const ticketTypeToText = (type) => {
  switch (type) {
    case 1: return 'Lượt';
    case 2: return 'Ngày';
    case 3: return 'HSSV';
    default: return 'Khác';
  }
};

const DetailTicket = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.metroticketingsystem.site/api/catalog/Tickets/${id}`)
      .then(res => res.json())
      .then(data => {
        setTicket(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!ticket) return <Typography color="error">Không tìm thấy vé.</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Chi tiết vé
        </Typography>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Typography><strong>Tên vé:</strong> {ticket.name}</Typography>
          <Typography><strong>Thời hạn (ngày):</strong> {ticket.expirationInDay}</Typography>
          <Typography><strong>Giá (VNĐ):</strong> {formatPrice(ticket.price)}</Typography>
          <Typography><strong>Loại vé:</strong> {ticketTypeToText(ticket.ticketType)}</Typography>
          <Typography><strong>Hiệu lực (ngày):</strong> {ticket.activeInDay}</Typography>
        </Stack>
        <Button component={Link} to="/ticket" variant="outlined">
          Quay lại danh sách vé
        </Button>
      </CardContent>
    </Card>
  );
};

export default DetailTicket;
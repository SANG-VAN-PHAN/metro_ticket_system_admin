import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, Stack, Button, CircularProgress, Box
} from '@mui/material';

// Hàm format số tiền với phân cách hàng nghìn
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Hàm chuyển đổi loại vé thành text
const ticketTypeToText = (type) => {
  switch (type) {
    case 1: return 'Vé lượt';
    case 2: return 'Vé ngày';
    case 3: return 'Vé học sinh sinh viên';
    default: return 'Khác';
  }
};

const DetailTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`https://api.metroticketingsystem.site/api/catalog/Tickets/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải thông tin vé');
      }
      
      const data = await response.json();
      
      // Xử lý response data
      if (data.succeeded && data.data) {
        setTicket(data.data);
      } else if (data.id) {
        // Nếu response trả về trực tiếp object ticket
        setTicket(data);
      } else {
        setError('Không tìm thấy vé');
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải thông tin vé');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Chi tiết vé
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error || !ticket) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Chi tiết vé
          </Typography>
          <Typography color="error" sx={{ mb: 2 }}>
            {error || 'Không tìm thấy vé'}
          </Typography>
          <Button 
            component={Link} 
            to="/ticket" 
            variant="outlined"
          >
            Quay lại danh sách vé
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Chi tiết vé
        </Typography>
        
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h6">
            <strong>Tên vé:</strong> {ticket.name}
          </Typography>
          <Typography>
            <strong>Thời hạn sử dụng:</strong> {ticket.expirationInDay} ngày
          </Typography>
          <Typography>
            <strong>Giá vé:</strong> {formatPrice(ticket.price)} VNĐ
          </Typography>
          <Typography>
            <strong>Loại vé:</strong> {ticketTypeToText(ticket.ticketType)}
          </Typography>
          <Typography>
            <strong>Thời gian hiệu lực:</strong> {ticket.activeInDay} ngày
          </Typography>
          <Typography>
            <strong>Mã vé:</strong> {ticket.id}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={2}>
          <Button 
            component={Link} 
            to="/ticket" 
            variant="outlined"
          >
            Quay lại danh sách
          </Button>
          <Button 
            component={Link} 
            to={`/ticket/update/${ticket.id}`} 
            variant="contained"
            color="primary"
          >
            Cập nhật vé
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DetailTicket;
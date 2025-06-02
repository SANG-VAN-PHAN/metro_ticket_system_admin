import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const tickets = [
  {
    id: 1,
    code: 'TKT001',
    route: 'Tuyến số 1',
    customer: 'Nguyễn Văn A',
    price: 15000,
    status: 'Đã sử dụng'
  },
  {
    id: 2,
    code: 'TKT002',
    route: 'Tuyến số 2',
    customer: 'Trần Thị B',
    price: 20000,
    status: 'Chưa sử dụng'
  },
  {
    id: 3,
    code: 'TKT003',
    route: 'Tuyến số 1',
    customer: 'Lê Văn C',
    price: 15000,
    status: 'Đã hủy'
  }
];

const statusColor = (status) => {
  switch (status) {
    case 'Đã sử dụng':
      return 'success';
    case 'Chưa sử dụng':
      return 'warning';
    case 'Đã hủy':
      return 'error';
    default:
      return 'default';
  }
};

const ViewTicket = () => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Danh sách vé
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button component={Link} to="/ticket/create" variant="contained" color="primary">
          Thêm vé mới
        </Button>
        <Button component={Link} to="/ticket/delete" variant="outlined" color="error">
          Xóa vé
        </Button>
        <Button component={Link} to="/ticket/update" variant="outlined" color="secondary">
          Cập nhật vé
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã vé</TableCell>
              <TableCell>Tuyến</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Giá vé</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.code}</TableCell>
                <TableCell>{ticket.route}</TableCell>
                <TableCell>{ticket.customer}</TableCell>
                <TableCell>{ticket.price.toLocaleString()} đ</TableCell>
                <TableCell>
                  <Chip label={ticket.status} color={statusColor(ticket.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

export default ViewTicket;
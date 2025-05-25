import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper } from '@mui/material';

const busRoutes = [
  {
    id: 1,
    routeNumber: '01',
    start: 'Bến xe Miền Đông',
    end: 'Bến xe Chợ Lớn',
    departure: '06:00',
    status: 'Đang chạy'
  },
  {
    id: 2,
    routeNumber: '02',
    start: 'Bến xe An Sương',
    end: 'Bến xe Miền Tây',
    departure: '06:30',
    status: 'Tạm dừng'
  },
  {
    id: 3,
    routeNumber: '03',
    start: 'Bến Thành',
    end: 'Thủ Đức',
    departure: '07:00',
    status: 'Đang chạy'
  }
];

const statusColor = (status) => {
  switch (status) {
    case 'Đang chạy':
      return 'success';
    case 'Tạm dừng':
      return 'warning';
    default:
      return 'default';
  }
};

const ViewBusRoutes = () => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Danh sách tuyến xe buýt
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Số tuyến</TableCell>
              <TableCell>Điểm đầu</TableCell>
              <TableCell>Điểm cuối</TableCell>
              <TableCell>Giờ xuất phát</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {busRoutes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.routeNumber}</TableCell>
                <TableCell>{route.start}</TableCell>
                <TableCell>{route.end}</TableCell>
                <TableCell>{route.departure}</TableCell>
                <TableCell>
                  <Chip label={route.status} color={statusColor(route.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

export default ViewBusRoutes;
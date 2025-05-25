import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper } from '@mui/material';

const metroRoutes = [
  {
    id: 1,
    routeName: 'Tuyến số 1',
    start: 'Bến Thành',
    end: 'Suối Tiên',
    stations: 14,
    status: 'Đang hoạt động'
  },
  {
    id: 2,
    routeName: 'Tuyến số 2',
    start: 'Bến Thành',
    end: 'Tham Lương',
    stations: 11,
    status: 'Đang xây dựng'
  },
  {
    id: 3,
    routeName: 'Tuyến số 3A',
    start: 'Bến Thành',
    end: 'Bến xe Miền Tây',
    stations: 10,
    status: 'Đang quy hoạch'
  }
];

const statusColor = (status) => {
  switch (status) {
    case 'Đang hoạt động':
      return 'success';
    case 'Đang xây dựng':
      return 'warning';
    case 'Đang quy hoạch':
      return 'default';
    default:
      return 'default';
  }
};

const ViewRoutes = () => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Danh sách tuyến đường Metro
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên tuyến</TableCell>
              <TableCell>Điểm đầu</TableCell>
              <TableCell>Điểm cuối</TableCell>
              <TableCell>Số ga</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metroRoutes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>{route.routeName}</TableCell>
                <TableCell>{route.start}</TableCell>
                <TableCell>{route.end}</TableCell>
                <TableCell>{route.stations}</TableCell>
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

export default ViewRoutes;
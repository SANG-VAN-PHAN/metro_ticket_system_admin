import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const stations = [
  {
    id: 1,
    name: 'Bến Thành',
    line: 'Tuyến số 1',
    location: 'Quận 1',
    status: 'Đang hoạt động'
  },
  {
    id: 2,
    name: 'Suối Tiên',
    line: 'Tuyến số 1',
    location: 'Thủ Đức',
    status: 'Đang hoạt động'
  },
  {
    id: 3,
    name: 'Tham Lương',
    line: 'Tuyến số 2',
    location: 'Quận 12',
    status: 'Đang xây dựng'
  }
];

const statusColor = (status) => {
  switch (status) {
    case 'Đang hoạt động':
      return 'success';
    case 'Đang xây dựng':
      return 'warning';
    default:
      return 'default';
  }
};

const ViewStations = () => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Danh sách các ga Metro
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button component={Link} to="/stations/create" variant="contained" color="primary">
          Thêm ga mới
        </Button>
        <Button component={Link} to="/stations/delete" variant="outlined" color="error">
          Xóa ga
        </Button>
        <Button component={Link} to="/stations/update" variant="outlined" color="secondary">
          Cập nhật ga
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên ga</TableCell>
              <TableCell>Tuyến</TableCell>
              <TableCell>Vị trí</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((station) => (
              <TableRow key={station.id}>
                <TableCell>{station.name}</TableCell>
                <TableCell>{station.line}</TableCell>
                <TableCell>{station.location}</TableCell>
                <TableCell>
                  <Chip label={station.status} color={statusColor(station.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

export default ViewStations;
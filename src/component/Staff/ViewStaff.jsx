import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper, Avatar, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const staffList = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    position: 'Quản lý',
    email: 'a.nguyen@example.com',
    status: 'Đang làm',
    avatar: ''
  },
  {
    id: 2,
    name: 'Trần Thị B',
    position: 'Nhân viên bán vé',
    email: 'b.tran@example.com',
    status: 'Nghỉ việc',
    avatar: ''
  },
  {
    id: 3,
    name: 'Lê Văn C',
    position: 'Tài xế',
    email: 'c.le@example.com',
    status: 'Đang làm',
    avatar: ''
  }
];

const statusColor = (status) => {
  switch (status) {
    case 'Đang làm':
      return 'success';
    case 'Nghỉ việc':
      return 'error';
    default:
      return 'default';
  }
};

const ViewStaff = () => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Danh sách nhân viên
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button component={Link} to="/staff/create" variant="contained" color="primary">
          Thêm nhân viên
        </Button>
        <Button component={Link} to="/staff/delete" variant="outlined" color="error">
          Xóa nhân viên
        </Button>
        <Button component={Link} to="/staff/update" variant="outlined" color="secondary">
          Cập nhật nhân viên
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Chức vụ</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <Avatar alt={staff.name} src={staff.avatar} />
                </TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  <Chip label={staff.status} color={statusColor(staff.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

export default ViewStaff;
import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const initialStaff = [
  { id: 1, name: 'Nguyễn Văn A', position: 'Quản lý', email: 'a@gmail.com', phone: '0909123456', status: 'Đang làm việc' },
  { id: 2, name: 'Trần Thị B', position: 'Nhân viên', email: 'b@gmail.com', phone: '0909234567', status: 'Đang làm việc' },
  { id: 3, name: 'Lê Văn C', position: 'Nhân viên', email: 'c@gmail.com', phone: '0909345678', status: 'Đã nghỉ việc' }
];

const DeleteStaff = () => {
  const [staffs, setStaffs] = useState(initialStaff);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (staff) => {
    setSelected(staff);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const handleDelete = () => {
    setStaffs(staffs.filter((s) => s.id !== selected.id));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Xóa nhân viên
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffs.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>{staff.status}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleOpen(staff)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc muốn xóa nhân viên <b>{selected?.name}</b> không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DeleteStaff;
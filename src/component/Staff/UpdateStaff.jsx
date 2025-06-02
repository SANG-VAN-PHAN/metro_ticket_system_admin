import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const initialStaff = [
  { id: 1, name: 'Nguyễn Văn A', position: 'Quản lý', email: 'a@gmail.com', phone: '0909123456', status: 'Đang làm việc' },
  { id: 2, name: 'Trần Thị B', position: 'Nhân viên', email: 'b@gmail.com', phone: '0909234567', status: 'Đang làm việc' },
  { id: 3, name: 'Lê Văn C', position: 'Nhân viên', email: 'c@gmail.com', phone: '0909345678', status: 'Đã nghỉ việc' }
];

const UpdateStaff = () => {
  const [staffs, setStaffs] = useState(initialStaff);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    status: 'Đang làm việc'
  });

  const handleOpen = (staff) => {
    setSelected(staff);
    setForm(staff);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setForm({
      name: '',
      position: '',
      email: '',
      phone: '',
      status: 'Đang làm việc'
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setStaffs(staffs.map((s) => (s.id === selected.id ? { ...form, id: selected.id } : s)));
    handleClose();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật thông tin nhân viên
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
                    <IconButton color="primary" onClick={() => handleOpen(staff)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Cập nhật nhân viên</DialogTitle>
          <form onSubmit={handleUpdate}>
            <DialogContent>
              <TextField
                label="Họ và tên"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Chức vụ"
                name="position"
                value={form.position}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Số điện thoại"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                select
                label="Trạng thái"
                name="status"
                value={form.status}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Đang làm việc">Đang làm việc</MenuItem>
                <MenuItem value="Đã nghỉ việc">Đã nghỉ việc</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Hủy</Button>
              <Button type="submit" variant="contained">
                Cập nhật
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UpdateStaff;
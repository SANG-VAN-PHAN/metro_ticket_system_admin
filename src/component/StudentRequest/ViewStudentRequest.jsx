import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Alert, CircularProgress, Avatar, Pagination, Button, IconButton, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewStudentRequest = () => {
  const [students, setStudents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const fetchRequests = async (pageNumber = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest?page=${pageNumber - 1}`);
      if (!res.ok) throw new Error('Không thể lấy danh sách yêu cầu!');
      const data = await res.json();
      setStudents(data.data.students || []);
      setTotalPages(data.data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests(page);
    // eslint-disable-next-line
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Xóa thất bại!');
      setStudents((prev) => prev.filter((stu) => stu.id !== id));
    } catch (err) {
      alert(err.message || 'Có lỗi khi xóa!');
    }
    setDeletingId(null);
  };

  return (
    <Box maxWidth={1100} mx="auto" mt={5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Danh sách yêu cầu xác thực sinh viên
        </Typography>
        {/* <Button variant="contained" color="primary" onClick={() => navigate('/student-request/create')}>
          Tạo yêu cầu
        </Button> */}
      </Stack>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ảnh thẻ SV</TableCell>
                  <TableCell>Mã SV</TableCell>
                  <TableCell>Email SV</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Trường</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Không có yêu cầu nào.</TableCell>
                  </TableRow>
                ) : (
                  students.map((stu) => (
                    <TableRow key={stu.id}>
                      <TableCell>
                        <Avatar
                          src={stu.studentCardImageUrl}
                          alt={stu.studentCode}
                          variant="rounded"
                          sx={{ width: 56, height: 56 }}
                        />
                      </TableCell>
                      <TableCell>{stu.studentCode}</TableCell>
                      <TableCell>{stu.studentEmail}</TableCell>
                      <TableCell>
                        {stu.fullName
                          ? `${stu.fullName.lastName} ${stu.fullName.firstName}`
                          : ''}
                      </TableCell>
                      <TableCell>{stu.schoolName}</TableCell>
                      <TableCell>
                        {stu.dateOfBirth
                          ? new Date(stu.dateOfBirth).toLocaleDateString()
                          : ''}
                      </TableCell>
                      <TableCell>{stu.status}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/student-request/${stu.id}`)}
                          title="Sửa"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(stu.id)}
                          disabled={deletingId === stu.id}
                          title="Xóa"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ViewStudentRequest;
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Alert, CircularProgress, Avatar, Pagination, Button, IconButton, Stack, Card, CardContent, Tooltip, useTheme, useMediaQuery
} from '@mui/material';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CheckCircle } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import mrtBanner from '../../assets/images/mrt_train_banner.svg';

const ViewStudentRequest = () => {
  const [students, setStudents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);

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
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/Declined/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Xóa thất bại!');
      await fetchRequests(page); // Reload data after action
    } catch (err) {
      alert(err.message || 'Có lỗi khi xóa!');
    }
    setDeletingId(null);
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt yêu cầu này?')) return;
    setApprovingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/Approve/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Duyệt không thành công!');
      await fetchRequests(page); // Reload data after action
    } catch (err) {
      alert(err.message || 'Có lỗi khi xóa!');
    }
    setApprovingId(null);
  };

  // Status color mapping for Chip and label
  const getStatusProps = (status) => {
    switch (status) {
      case 1:
        return { label: 'Chờ xét duyệt', color: 'warning' };
      case 2:
        return { label: 'Đã duyệt', color: 'success' };
      case 3:
        return { label: 'Đã từ chối', color: 'error' };
      default:
        return { label: 'Không rõ', color: 'default' };
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box maxWidth={1100} mx="auto" mt={5} px={isMobile ? 1 : 0}>
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems={isMobile ? 'flex-start' : 'center'} mb={2} gap={2}>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              Danh sách yêu cầu xác thực sinh viên
            </Typography>
          </Stack>
          {loading && (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={300}>
              <CircularProgress sx={{ mt: 2 }} />
              <Typography variant="subtitle1" color="text.secondary" mt={2}>Đang tải dữ liệu...</Typography>
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {!loading && !error && (
            <>
              <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 1 }}>
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow sx={{ background: theme.palette.grey[100] }}>
                      <TableCell><b>Ảnh thẻ SV</b></TableCell>
                      <TableCell><b>Mã SV</b></TableCell>
                      <TableCell><b>Email SV</b></TableCell>
                      <TableCell><b>Họ tên</b></TableCell>
                      <TableCell><b>Trường</b></TableCell>
                      <TableCell><b>Ngày sinh</b></TableCell>
                      <TableCell><b>Trạng thái</b></TableCell>
                      <TableCell align="center"><b>Thao tác</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <img src={mrtBanner} alt="No data" style={{ width: 180, opacity: 0.7, marginBottom: 16 }} />
                            <Typography variant="h6" color="text.secondary">Không có yêu cầu nào.</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((stu, idx) => (
                        <TableRow key={stu.id} sx={{ background: idx % 2 === 0 ? theme.palette.grey[50] : '#fff', transition: 'background 0.2s', '&:hover': { background: theme.palette.action.hover } }}>
                          <TableCell>
                            <Avatar
                              src={stu.studentCardImageUrl}
                              alt={stu.studentCode}
                              variant="rounded"
                              sx={{ width: 56, height: 56, border: `2px solid ${theme.palette.primary.light}` }}
                            />
                          </TableCell>
                          <TableCell><Typography fontWeight={500}>{stu.studentCode}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{stu.studentEmail}</Typography></TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {stu.fullName
                                ? `${stu.fullName.lastName} ${stu.fullName.firstName}`
                                : ''}
                            </Typography>
                          </TableCell>
                          <TableCell><Typography variant="body2">{stu.schoolName}</Typography></TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {stu.dateOfBirth
                                ? new Date(stu.dateOfBirth).toLocaleDateString()
                                : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const { label, color } = getStatusProps(stu.status);
                              return (
                                <Chip
                                  label={label}
                                  color={color}
                                  size="small"
                                  sx={{ fontWeight: 600, letterSpacing: 0.2 }}
                                />
                              );
                            })()}
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                              {stu.status === 1 ? (
                                <>
                                  <Tooltip title="Duyệt">
                                    <span>
                                      <IconButton
                                        color="success"
                                        onClick={() => handleApprove(stu.id)}
                                        disabled={approvingId === stu.id}
                                        size={isMobile ? 'small' : 'medium'}
                                      >
                                        <CheckCircle />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                  <Tooltip title="Từ chối">
                                    <span>
                                      <IconButton
                                        color="error"
                                        onClick={() => handleDelete(stu.id)}
                                        disabled={deletingId === stu.id}
                                        size={isMobile ? 'small' : 'medium'}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </>
                              ) : (
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                  <LockOutlinedIcon color="disabled" fontSize="small" />
                                  <Typography variant="caption" color="text.secondary">Không thể thao tác với yêu cầu này</Typography>
                                </Stack>
                              )}
                            </Stack>
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
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewStudentRequest;
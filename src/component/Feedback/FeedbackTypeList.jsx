import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Stack, IconButton, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const FeedbackTypeList = () => {
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchFeedbackTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/user/FeedbackTypes', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.succeeded && Array.isArray(data.data)) {
        setFeedbackTypes(data.data);
      } else {
        setFeedbackTypes([]);
        setError(data.message || 'Không thể tải danh sách loại feedback');
      }
    } catch {
      setError('Không thể tải danh sách loại feedback');
      setFeedbackTypes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbackTypes();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa loại feedback này?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/FeedbackTypes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 204) {
        setSuccess('Xóa thành công!');
        fetchFeedbackTypes();
      } else {
        let data = {};
        try { data = await res.json(); } catch {}
        setError(data.message || 'Xóa thất bại');
      }
    } catch {
      setError('Xóa thất bại');
    }
    setDeletingId(null);
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="column" alignItems="flex-start" mb={2}>
          <Typography variant="h4" sx={{ mb: 1 }}>Danh sách loại Feedback</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/feedback-types/create')}>
            Thêm loại feedback
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên loại</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Cập nhật lần cuối</TableCell>
                <TableCell>Đã xóa</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                feedbackTypes.map(type => (
                  <TableRow key={type.id}>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{type.description}</TableCell>
                    <TableCell>{type.createdAt ? new Date(type.createdAt).toLocaleString() : ''}</TableCell>
                    <TableCell>{type.lastModifiedAt && type.lastModifiedAt !== '0001-01-01T00:00:00+00:00' ? new Date(type.lastModifiedAt).toLocaleString() : ''}</TableCell>
                    <TableCell>{type.deleteFlag ? 'Đã xóa' : 'Hoạt động'}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => navigate(`/feedback-types/update/${type.id}`)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(type.id)} size="small" disabled={deletingId === type.id}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}><Alert severity="error">{error}</Alert></Snackbar>
        <Snackbar open={!!success} autoHideDuration={2000} onClose={() => setSuccess('')}><Alert severity="success">{success}</Alert></Snackbar>
      </CardContent>
    </Card>
  );
};

export default FeedbackTypeList; 
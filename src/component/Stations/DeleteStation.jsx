import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
const DeleteStation = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchStations = () => {
    setLoading(true);
    fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setStations(data.data.stations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleOpenDialog = (station) => {
    setSelected(station);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations/${selected.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Lỗi khi xóa nhà ga!');
      setSuccess(true);
      handleCloseDialog();
      fetchStations();
    } catch (err) {
      setError('Không thể xóa nhà ga. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Xóa nhà ga
        </Typography>
        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate('/stations')}
                          sx={{ mb: 2 }}
                        >
                          Quay lại danh sách
                        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã ga</TableCell>
                <TableCell>Tên ga</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : stations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                stations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.code}</TableCell>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleOpenDialog(station)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc muốn xóa ga <b>{selected?.name}</b> không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Xóa nhà ga thành công!
          </Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default DeleteStation;
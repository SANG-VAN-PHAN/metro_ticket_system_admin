import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const DeletePriceRange = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetchPriceRange();
    // eslint-disable-next-line
  }, [id]);

  const fetchPriceRange = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/PriceRanges/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && (data.succeeded && data.data || data.id)) {
        setPriceRange(data.data || data);
      } else {
        setError('Không tìm thấy khoảng giá!');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/PriceRanges/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (res.status === 204) {
        setSuccess(true);
        setTimeout(() => navigate('/price-ranges'), 1500);
        return;
      }
      let data = null;
      try {
        data = await res.json();
      } catch {}
      if (!res.ok || (data && data.succeeded === false)) {
        throw new Error(data && data.message ? data.message : 'Không thể xoá khoảng giá!');
      }
      setSuccess(true);
      setTimeout(() => navigate('/price-ranges'), 1500);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra!');
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/price-ranges');
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Xoá khoảng giá vé
          </Typography>
          <Typography>Đang tải dữ liệu...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Xác nhận xoá khoảng giá vé</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn xoá khoảng giá "{priceRange?.name}"?</Typography>
        <Typography color="error" sx={{ mt: 1 }}>Hành động này không thể hoàn tác!</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={deleting}>Huỷ</Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
          {deleting ? 'Đang xoá...' : 'Xoá'}
        </Button>
      </DialogActions>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="success">Xoá thành công!</Alert>
      </Snackbar>
    </Dialog>
  );
};

export default DeletePriceRange; 
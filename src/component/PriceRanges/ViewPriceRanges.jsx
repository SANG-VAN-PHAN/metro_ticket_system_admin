import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Button, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Link } from 'react-router-dom';

const pageSize = 8;

const ViewPriceRanges = () => {
  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPriceRanges();
    // eslint-disable-next-line
  }, [page]);

  const fetchPriceRanges = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        deleteFlag: 'false'
      });
      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/PriceRanges?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      let priceRangesArr = [];
      let totalPagesVal = 1;
      // Luôn lấy từ data.priceRanges, data.totalPages, data.currentPage, data.pageSize
      if (res.ok && data.succeeded && data.data) {
        priceRangesArr = data.data.priceRanges || [];
        totalPagesVal = data.data.totalPages || 1;
      }
      setPriceRanges(priceRangesArr);
      setTotalPages(totalPagesVal);
    } catch (err) {
      setError('Không thể tải danh sách khoảng giá vé!');
      setPriceRanges([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => setPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setPage(prev => Math.min(totalPages - 1, prev + 1));

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Quản lý khoảng giá vé
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button component={Link} to="/price-ranges/create" variant="contained" color="primary">
            Thêm khoảng giá mới
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Từ (km)</TableCell>
                <TableCell>Đến (km)</TableCell>
                <TableCell>Giá vé (VNĐ) / km</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={28} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : priceRanges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                priceRanges.map((range, idx) => (
                  <TableRow key={range.id}>
                    <TableCell>{page * pageSize + idx + 1}</TableCell>
                    <TableCell>{range.fromKm}</TableCell>
                    <TableCell>{range.toKm}</TableCell>
                    <TableCell>{range.price?.toLocaleString('vi-VN')}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button component={Link} to={`/price-ranges/${range.id}`} variant="outlined" size="small">
                          Chi tiết
                        </Button>
                        <Button component={Link} to={`/price-ranges/update/${range.id}`} variant="outlined" size="small">
                          Cập nhật
                        </Button>
                        <Button component={Link} to={`/price-ranges/delete/${range.id}`} variant="outlined" size="small" color="error">
                          Xóa
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        {totalPages > 1 && (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 2 }}>
            <Button size="small" disabled={page === 0} onClick={handlePrevPage} variant="outlined">
              Trước
            </Button>
            <Typography sx={{ alignSelf: 'center' }}>
              Trang {page + 1} / {totalPages}
            </Typography>
            <Button size="small" disabled={page + 1 >= totalPages} onClick={handleNextPage} variant="outlined">
              Sau
            </Button>
          </Stack>
        )}
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default ViewPriceRanges; 
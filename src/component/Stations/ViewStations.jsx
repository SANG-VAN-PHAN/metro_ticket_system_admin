import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Button, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

const ViewStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setStations(data.data.stations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
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
                <TableCell>Mã ga</TableCell>
                <TableCell>Tên ga</TableCell>
                <TableCell>Ảnh đại diện</TableCell>
                <TableCell>Địa chỉ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : stations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                </TableRow>
              ) : (
                stations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.code}</TableCell>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>
                      {station.thumbnailImageUrl && station.thumbnailImageUrl !== 'empty' ? (
                        <Avatar src={station.thumbnailImageUrl} alt={station.name} />
                      ) : (
                        <Avatar>{station.name?.[0] || '?'}</Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      {[station.streetNumber, station.street, station.ward, station.district, station.city]
                        .filter(Boolean)
                        .join(', ') || 'Chưa cập nhật'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ViewStations;
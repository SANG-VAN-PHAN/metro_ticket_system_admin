import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Stack, Chip, Paper, List, ListItem, ListItemText, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

const statusColor = (status) => {
  switch (status) {
    case 'Đang hoạt động':
      return 'success';
    case 'Đang xây dựng':
      return 'warning';
    case 'Đang quy hoạch':
      return 'default';
    default:
      return 'default';
  }
};

const DetailRoute = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [stationName, setStationName] = useState('');
  const [distance, setDistance] = useState('');

  // Lấy thông tin route và danh sách station
  useEffect(() => {
    fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setRoute(data.data);
        setStations(data.data.stationList || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Thêm station mới và cập nhật list_station cho route
  const handleAddStation = async () => {
  if (!stationName) return;
  try {
    // 1. Gọi API tạo station mới
    const resStation = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        id: uuidv4(),
        name: stationName
      }).toString()
    });
    if (!resStation.ok) throw new Error('Lỗi khi thêm nhà ga!');
    const stationData = await resStation.json();
    const newStationId = stationData.data.id || stationData.data.stationId;

    // 2. Tạo list_station mới cho route
    let newListStation = stations.map((st, idx) => ({
      stationId: st.id || st.stationId,
      order: idx + 1,
      // Nếu là station cuối cùng, cập nhật distanceToNext bằng khoảng cách vừa nhập
      distanceToNext: idx === stations.length - 1 && stations.length > 0
        ? (distance ? parseFloat(distance) : 0)
        : st.distanceToNext || 0
    }));

    // Thêm station mới vào cuối, distanceToNext luôn là 0
    newListStation.push({
      stationId: newStationId,
      order: stations.length + 1,
      distanceToNext: 0
    });

    // 3. Gọi API cập nhật route với list_station mới
    const resRoute = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        routeId: id,
        list_station: newListStation
      })
    });
    if (!resRoute.ok) throw new Error('Lỗi khi cập nhật tuyến!');

    // Reload lại danh sách station
    setStations([
      ...stations.map((st, idx) =>
        idx === stations.length - 1 && stations.length > 0
          ? { ...st, distanceToNext: distance ? parseFloat(distance) : 0 }
          : st
      ),
      {
        id: newStationId,
        name: stationName,
        distanceToNext: 0
      }
    ]);
    setStationName('');
    setDistance('');
    setOpenDialog(false);
  } catch (err) {
    alert('Không thể thêm nhà ga. Vui lòng thử lại!');
  }
};

  if (loading) return <CircularProgress />;
  if (!route) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" color="error">Không tìm thấy tuyến đường!</Typography>
          <Button component={Link} to="/metro-routes" variant="contained" sx={{ mt: 2 }}>
            Quay lại danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Chi tiết tuyến Metro
        </Typography>
        <Typography variant="h6" gutterBottom>
          {route.name}
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography>Mã tuyến: <b>{route.code}</b></Typography>
          <Typography>Chiều dài: <b>{route.lengthInKm} km</b></Typography>
          <Typography>
            Trạng thái: <Chip label={route.status || 'Chưa rõ'} color={statusColor(route.status)} />
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Danh sách nhà ga:
          </Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Thêm nhà ga
          </Button>
        </Stack>
        <Paper variant="outlined" sx={{ mb: 2 }}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {stations.map((station, index) => (
              <React.Fragment key={station.id || station.stationId || station.name}>
                {index > 0 && (
                  <ListItem sx={{ pl: 6, pr: 6 }}>
                    <Typography color="text.secondary" fontStyle="italic">
                      Khoảng cách đến ga trước: {stations[index - 1]?.distanceToNext ?? 0} km
                    </Typography>
                  </ListItem>
                )}
                <ListItem>
                  <ListItemText
                    primary={`${index + 1}. ${station.name || station.stationName}`}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
        <Button component={Link} to="/metro-routes" variant="outlined">
          Quay lại danh sách
        </Button>

        {/* Dialog thêm nhà ga */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Thêm nhà ga mới</DialogTitle>
          <DialogContent>
            <TextField
              label="Tên nhà ga"
              value={stationName}
              onChange={e => setStationName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {stations.length > 0 && (
              <TextField
                label="Khoảng cách từ ga trước (km)"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                type="number"
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button onClick={handleAddStation} variant="contained">Thêm</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DetailRoute;
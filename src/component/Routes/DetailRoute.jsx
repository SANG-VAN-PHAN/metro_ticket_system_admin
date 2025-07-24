import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, Button, Stack, Chip, Paper, List, ListItem, ListItemText,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Box, Alert, IconButton, Avatar, FormControl, InputLabel, Select
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

// ✅ THÊM HÀM FORMAT SỐ THẬP PHÂN
const formatDecimal = (value, decimals = 2) => {
  if (!value || value === '') return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  return num.toFixed(decimals);
};

// ✅ THÊM HÀM VALIDATE INPUT
const validateDistanceInput = (value) => {
  // Chỉ cho phép số, dấu chấm và tối đa 2 số thập phân
  const regex = /^\d*\.?\d{0,2}$/;
  return regex.test(value);
};

const DetailRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [stations, setStations] = useState([]);
  const [distances, setDistances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [stationSearch, setStationSearch] = useState('');
  const [debouncedStationSearch, setDebouncedStationSearch] = useState('');
  const [stationPage, setStationPage] = useState(0);
  const [stationTotalPages, setStationTotalPages] = useState(1);
  const stationPageSize = 8;

  // Kiểm tra authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      navigate('/application/login');
      return;
    }
    
    if (role !== 'Administrator') {
      navigate('/dashboard/default');
      return;
    }
  }, [navigate]);

  // Lấy thông tin route và danh sách station của route
  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Route ID không hợp lệ');
      setLoading(false);
      return;
    }

    const fetchRouteData = async () => {
      try {
        const response = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Không tìm thấy tuyến đường này');
          }
          throw new Error(`Lỗi server: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.data) {
          throw new Error('Dữ liệu không hợp lệ');
        }

        // Sắp xếp lại theo order nếu có
        const sortedStations = (data.data.stations || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        setRoute(data.data);
        setStations(sortedStations);
        // ✅ FORMAT DISTANCES VỚI 2 SỐ THẬP PHÂN
        setDistances(sortedStations.map(st => formatDecimal(st.distanceToNext || 0)));
        
      } catch (err) {
        console.error('Error fetching route:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [id]);

  // Debounce station search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStationSearch(stationSearch);
    }, 400);
    return () => clearTimeout(handler);
  }, [stationSearch]);

  // Lấy danh sách tất cả các station (dùng cho select)
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?page=${stationPage}&pageSize=${stationPageSize}&name=${encodeURIComponent(debouncedStationSearch)}&status=false`, {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (res.ok && data.succeeded && data.data && Array.isArray(data.data.stations)) {
          setStationList(data.data.stations);
          setStationTotalPages(data.data.totalPages || 1);
        } else {
          setStationList([]);
          setStationTotalPages(1);
        }
      } catch {
        setStationList([]);
        setStationTotalPages(1);
      }
    };
    fetchStations();
  }, [debouncedStationSearch, stationPage]);

  // Thêm station đã chọn vào cuối danh sách
  const handleAddStation = () => {
    if (!selectedStationId) return;
    const addedStation = stationList.find(st => st.id === selectedStationId);
    if (addedStation) {
      setStations(prev => [...prev, addedStation]);
      setDistances(prev => [...prev, '0.00']); // ✅ FORMAT VỚI 2 SỐ THẬP PHÂN
      setSelectedStationId('');
      setOpenDialog(false);
    }
  };

  // Xóa station khỏi danh sách
  const handleRemoveStation = (indexToRemove) => {
    setStations(prev => prev.filter((_, index) => index !== indexToRemove));
    setDistances(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Xử lý kéo thả
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const newStations = Array.from(stations);
    const [removed] = newStations.splice(result.source.index, 1);
    newStations.splice(result.destination.index, 0, removed);

    const newDistances = Array.from(distances);
    const [removedDist] = newDistances.splice(result.source.index, 1);
    newDistances.splice(result.destination.index, 0, removedDist);

    setStations(newStations);
    setDistances(newDistances);
  };

  // Cập nhật khoảng cách
  const handleDistanceChange = (idx, value) => {
    // Kiểm tra input hợp lệ
    if (value !== '' && !validateDistanceInput(value)) {
      return; // Không cho phép nhập nếu không hợp lệ
    }

    const newDistances = [...distances];
    newDistances[idx] = value;
    setDistances(newDistances);
  };

  // ✅ THÊM HÀM XỬ LÝ KHI BLUR (RỜI KHỎI INPUT)
  const handleDistanceBlur = (idx, value) => {
    if (value === '') return;
    
    const newDistances = [...distances];
    newDistances[idx] = formatDecimal(value); // Format về 2 số thập phân
    setDistances(newDistances);
  };

  // Lưu thay đổi lên backend
  const handleSave = async () => {
    try {
      // Đảm bảo đúng logic: distanceToNext của ga cuối luôn là 0, các ga khác lấy từ distances[index]
      const stationRoutes = stations.map((st, idx) => ({
        stationId: st.id || st.stationId,
        routeId: id,
        order: idx + 1,
        // ✅ PARSE FLOAT VỚI VALIDATION
        distanceToNext: idx === stations.length - 1 ? 0 : (parseFloat(distances[idx]) || 0)
      }));

      const resRoute = await fetch('https://api.metroticketingsystem.site/api/catalog/Routes/station-route', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          route: {
            routeId: id,
            stationRoutes: stationRoutes
          }
        })
      });

      if (!resRoute.ok) {
        const errorText = await resRoute.text();
        throw new Error(`Lỗi khi cập nhật tuyến: ${errorText}`);
      }

      // Reload lại danh sách station trong tuyến, sort theo order nếu có
      const response = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        const sortedStations = (data.data.stations || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        setRoute(data.data);
        setStations(sortedStations);
        // ✅ FORMAT DISTANCES AFTER RELOAD
        setDistances(sortedStations.map(st => formatDecimal(st.distanceToNext || 0)));
      }

      alert('Đã lưu thay đổi!');
    } catch (err) {
      alert(`Không thể lưu thay đổi: ${err.message}`);
      console.error(err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Card sx={{ backgroundColor: '#ffebee' }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="h6" gutterBottom>
            Có thể do:
          </Typography>
          <Typography component="ul">
            <li>Route ID không tồn tại</li>
            <li>Kết nối mạng bị gián đoạn</li>
            <li>Server đang bảo trì</li>
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button component={Link} to="/metro-routes" variant="contained">
              Quay lại danh sách
            </Button>
            <Button onClick={() => window.location.reload()} variant="outlined">
              Thử lại
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Route not found
  if (!route) {
    return (
      <Card sx={{ backgroundColor: '#ffebee' }}>
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
    <Card sx={{ backgroundColor: '#fff' }}>
      <CardContent>
        {/* Hiển thị ảnh thumbnail của tuyến nếu có */}
        {route.thumbnailImageUrl && (
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              src={route.thumbnailImageUrl}
              alt={route.name}
              variant="rounded"
              sx={{ width: 220, height: 120, boxShadow: 2 }}
            />
          </Box>
        )}
        <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
          Chi tiết tuyến Metro
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: '#388e3c' }}>
          {route.name}
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography>Mã tuyến: <b>{route.code}</b></Typography>
          {/* ✅ FORMAT CHIỀU DÀI VỚI 2 SỐ THẬP PHÂN */}
          <Typography>Chiều dài: <b>{formatDecimal(route.lengthInKm)} km</b></Typography>
          <Typography component="span">
            Trạng thái: <Chip label={route.status || 'Hoạt động'} color={statusColor(route.status)} />
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
            Danh sách nhà ga ({stations.length} ga):
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenDialog(true)}
            sx={{ 
              backgroundColor: '#4caf50', 
              '&:hover': { backgroundColor: '#45a049' } 
            }}
          >
            Thêm nhà ga
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ mb: 2, backgroundColor: '#fff', borderColor: '#e0e0e0' }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stations">
              {(provided) => (
                <List 
                  sx={{ width: '100%', bgcolor: 'transparent' }} 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                >
                  {stations.length === 0 ? (
                    <ListItem>
                      <ListItemText 
                        primary="Chưa có ga nào trong tuyến" 
                        sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}
                      />
                    </ListItem>
                  ) : (
                    stations.map((station, index) => (
                      <Draggable
                        key={station.id || station.stationId || station.name}
                        draggableId={String(station.id || station.stationId || station.name)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <ListItem 
                              sx={{ 
                                backgroundColor: snapshot.isDragging ? '#c8e6c9' : '#ffffff',
                                mb: 1, 
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                                boxShadow: snapshot.isDragging ? 3 : 1
                              }}
                            >
                              <IconButton {...provided.dragHandleProps} size="small">
                                <DragIndicatorIcon />
                              </IconButton>
                              <ListItemText
                                primary={`${index + 1}. ${station.name || station.stationName}`}
                                secondary={station.code ? `Mã: ${station.code}` : ''}
                              />
                              <IconButton 
                                onClick={() => handleRemoveStation(index)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItem>
                            
                            {index < stations.length - 1 && (
                              <ListItem sx={{ pl: 6, pr: 6, backgroundColor: 'transparent' }}>
                                <TextField
                                  label="Khoảng cách đến ga tiếp theo (km)"
                                  type="text" // ✅ ĐỔI THÀNH TEXT ĐỂ KIỂM SOÁT TỐT HỢN
                                  value={distances[index] || ''}
                                  onChange={e => handleDistanceChange(index, e.target.value)}
                                  onBlur={e => handleDistanceBlur(index, e.target.value)} // ✅ THÊM BLUR EVENT
                                  sx={{ 
                                    width: 250,
                                    '& .MuiOutlinedInput-root': {
                                      backgroundColor: '#ffffff'
                                    }
                                  }}
                                  size="small"
                                  helperText={`Từ ga ${index + 1} đến ga ${index + 2} (tối đa 2 số thập phân)`}
                                  placeholder="VD: 1.25"
                                  // ✅ THÊM PATTERN ĐỂ HINT CHO NGƯỜI DÙNG
                                  inputProps={{ 
                                    pattern: "\\d*\\.?\\d{0,2}",
                                    title: "Chỉ nhập số với tối đa 2 chữ số thập phân"
                                  }}
                                />
                              </ListItem>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>

        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/metro-routes" variant="outlined">
            Quay lại danh sách
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
            disabled={stations.length === 0}
            sx={{ 
              backgroundColor: '#4caf50', 
              '&:hover': { backgroundColor: '#45a049' } 
            }}
          >
            Lưu thay đổi
          </Button>
        </Stack>

        {/* Dialog thêm nhà ga */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: { backgroundColor: '#fff' }
          }}
        >
          <DialogTitle sx={{ color: '#2e7d32' }}>Thêm nhà ga vào tuyến</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="station-select-label">Chọn nhà ga</InputLabel>
              <Select
                labelId="station-select-label"
                value={selectedStationId}
                label="Chọn nhà ga"
                onChange={e => setSelectedStationId(e.target.value)}
                renderValue={selected => {
                  if (!selected) return '-- Chọn nhà ga --';
                  const st = stationList.find(s => s.id === selected);
                  return st ? `${st.name} (${st.code})` : '-- Chọn nhà ga --';
                }}
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 350, minWidth: 260, padding: 0 }
                  }
                }}
              >
                <Box px={2} pt={1} pb={0.5}>
                  <TextField
                    placeholder="Tìm theo tên ga"
                    value={stationSearch}
                    onChange={e => { setStationSearch(e.target.value); setStationPage(0); }}
                    size="small"
                    fullWidth
                    autoFocus
                  />
                </Box>
                <MenuItem value="">-- Chọn nhà ga --</MenuItem>
                {stationList
                  .filter(st => !stations.some(s => (s.id || s.stationId) === st.id))
                  .map(station => (
                    <MenuItem key={station.id} value={station.id}>
                      {station.name} ({station.code})
                    </MenuItem>
                  ))}
                <Box display="flex" justifyContent="space-between" alignItems="center" px={1} py={0.5}>
                  <IconButton size="medium" disabled={stationPage === 0} onClick={() => setStationPage(p => Math.max(0, p - 1))}>
                    <ArrowBackIosNewIcon fontSize="medium" />
                  </IconButton>
                  <Typography variant="caption">Trang {stationPage + 1} / {stationTotalPages}</Typography>
                  <IconButton size="medium" disabled={stationPage + 1 >= stationTotalPages} onClick={() => setStationPage(p => p + 1)}>
                    <ArrowForwardIosIcon fontSize="medium" />
                  </IconButton>
                </Box>
              </Select>
            </FormControl>
            {stationList.filter(st => !stations.some(s => (s.id || s.stationId) === st.id)).length === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Tất cả các ga đã được thêm vào tuyến
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button 
              onClick={handleAddStation} 
              variant="contained"
              disabled={!selectedStationId}
              sx={{ 
                backgroundColor: '#4caf50', 
                '&:hover': { backgroundColor: '#45a049' } 
              }}
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DetailRoute;
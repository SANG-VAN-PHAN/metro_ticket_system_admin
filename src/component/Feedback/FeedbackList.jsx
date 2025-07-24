import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Button, Stack, TextField, MenuItem, Select, FormControl, InputLabel, Box, IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const pageSize = 8;

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ feedbackTypeId: '', stationId: '' });
  const [pendingFilters, setPendingFilters] = useState({ feedbackTypeId: '', stationId: '' });
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  // Station search state
  const [stationSearch, setStationSearch] = useState('');
  const [stationPage, setStationPage] = useState(0);
  const [stationTotalPages, setStationTotalPages] = useState(1);
  const [stations, setStations] = useState([]);
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch feedback types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch('https://api.metroticketingsystem.site/api/user/FeedbackTypes', {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.succeeded && Array.isArray(data.data)) {
          setFeedbackTypes(data.data);
        } else {
          setFeedbackTypes([]);
        }
      } catch {
        setFeedbackTypes([]);
      }
    };
    fetchTypes();
    // eslint-disable-next-line
  }, []);

  // Fetch stations with search and pagination
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Stations?page=${stationPage}&pageSize=${pageSize}&name=${encodeURIComponent(stationSearch)}&status=false`, {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (res.ok && data.succeeded && data.data && Array.isArray(data.data.stations)) {
          setStations(data.data.stations);
          setStationTotalPages(data.data.totalPages || 1);
        } else {
          setStations([]);
          setStationTotalPages(1);
        }
      } catch {
        setStations([]);
        setStationTotalPages(1);
      }
    };
    fetchStations();
  }, [stationSearch, stationPage]);

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line
  }, [page, filters]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('pageSize', pageSize);
      if (filters.feedbackTypeId) params.append('feedbackTypeId', filters.feedbackTypeId);
      if (filters.stationId) params.append('stationId', filters.stationId);
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/Feedbacks/user-feedbacks?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.succeeded && data.data && Array.isArray(data.data.feedbacks)) {
        setFeedbacks(data.data.feedbacks);
        setTotalPages(data.data.totalPages || 1);
      } else {
        setFeedbacks([]);
        setError(data.message || 'Không thể tải danh sách feedback');
      }
    } catch {
      setError('Không thể tải danh sách feedback');
      setFeedbacks([]);
    }
    setLoading(false);
  };

  const handlePrevPage = () => setPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setPage(prev => Math.min(totalPages - 1, prev + 1));

  const handlePendingFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingFilters(prev => ({ ...prev, [name]: value }));
  };
  const handleApplyFilter = () => {
    setFilters(pendingFilters);
    setPage(0);
  };

  // Station dropdown handlers
  const handleStationSearchChange = (e) => {
    setStationSearch(e.target.value);
    setStationPage(0);
  };
  const handleStationDropdownOpen = () => setStationDropdownOpen(true);
  const handleStationDropdownClose = () => setStationDropdownOpen(false);
  const handleStationPageChange = (inc) => setStationPage((prev) => Math.max(0, Math.min(stationTotalPages - 1, prev + inc)));

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách Feedback
        </Typography>
        {/* Filter section */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Loại feedback</InputLabel>
            <Select
              label="Loại feedback"
              name="feedbackTypeId"
              value={pendingFilters.feedbackTypeId}
              onChange={handlePendingFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {feedbackTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Custom Station Dropdown with search and paging */}
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Ga</InputLabel>
            <Select
              label="Ga"
              name="stationId"
              value={pendingFilters.stationId}
              onChange={handlePendingFilterChange}
              open={stationDropdownOpen}
              onOpen={handleStationDropdownOpen}
              onClose={handleStationDropdownClose}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 350, minWidth: 220, padding: 0 }
                }
              }}
              renderValue={selected => {
                if (!selected) return 'Tất cả';
                const st = stations.find(s => s.id === selected);
                return st ? st.name : 'Chọn ga';
              }}
            >
              <Box px={2} pt={1} pb={0.5}>
                <TextField
                  placeholder="Tìm theo tên ga"
                  value={stationSearch}
                  onChange={handleStationSearchChange}
                  size="small"
                  fullWidth
                  autoFocus
                />
              </Box>
              <MenuItem value="">Tất cả</MenuItem>
              {stations.map(st => (
                <MenuItem key={st.id} value={st.id}>{st.name}</MenuItem>
              ))}
              <Box display="flex" justifyContent="space-between" alignItems="center" px={1} py={0.5}>
                <IconButton size="medium" disabled={stationPage === 0} onClick={() => handleStationPageChange(-1)}>
                  <ArrowBackIosNewIcon fontSize="medium" />
                </IconButton>
                <Typography variant="caption">Trang {stationPage + 1} / {stationTotalPages}</Typography>
                <IconButton size="medium" disabled={stationPage + 1 >= stationTotalPages} onClick={() => handleStationPageChange(1)}>
                  <ArrowForwardIosIcon fontSize="medium" />
                </IconButton>
              </Box>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleApplyFilter}>Tìm kiếm</Button>
        </Stack>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Ga</TableCell>
                    <TableCell>Loại feedback</TableCell>
                    <TableCell>Nội dung</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feedbacks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedbacks.map(fb => (
                      <TableRow key={fb.id}>
                        <TableCell>{fb.fullName ? `${fb.fullName.lastName} ${fb.fullName.firstName}` : ''}</TableCell>
                        <TableCell>{fb.stationName}</TableCell>
                        <TableCell>{fb.feedbackType?.name}</TableCell>
                        <TableCell>{fb.content}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination */}
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 2 }}>
              <Button size="small" disabled={page === 0} onClick={handlePrevPage} variant="outlined">
                Trước
              </Button>
              <Typography>
                Trang {page + 1} / {totalPages}
              </Typography>
              <Button size="small" disabled={page + 1 >= totalPages} onClick={handleNextPage} variant="outlined">
                Sau
              </Button>
            </Stack>
          </>
        )}
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default FeedbackList; 
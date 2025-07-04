import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Snackbar, Alert, Autocomplete, CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateBusRoute = () => {
  const [form, setForm] = useState({
    stationId: '',
    destinationName: ''
  });
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      setStationsLoading(true);
      try {
        const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (data.succeeded && data.data && data.data.stations) {
          setStations(data.data.stations);
        }
      } catch (err) {
        console.error('Error fetching stations:', err);
      } finally {
        setStationsLoading(false);
      }
    };
    
    fetchStations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStationChange = (event, newValue) => {
    setSelectedStation(newValue);
    setForm({ ...form, stationId: newValue ? newValue.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.stationId) {
      setError('Vui lòng chọn ga Metro');
      return;
    }
    
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          stationId: form.stationId,
          destinationName: form.destinationName
        })
      });
      if (!res.ok) throw new Error('Lỗi khi tạo tuyến xe buýt!');
      setSuccess(true);
      setTimeout(() => navigate('/bus-routes'), 1500);
    } catch (err) {
      setError('Không thể tạo tuyến xe buýt. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm tuyến xe buýt mới
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/bus-routes')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        <form onSubmit={handleSubmit}>
          <Autocomplete
            options={stations}
            getOptionLabel={(option) => `${option.name} (${option.code})`}
            value={selectedStation}
            onChange={handleStationChange}
            loading={stationsLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn ga Metro"
                margin="normal"
                required
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {stationsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TextField
            label="Tên điểm đến"
            name="destinationName"
            value={form.destinationName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            placeholder="Ví dụ: Chợ Bến Thành, Công viên Tao Đàn..."
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm tuyến xe buýt
          </Button>
        </form>
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Thêm tuyến xe buýt thành công!
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

export default CreateBusRoute;
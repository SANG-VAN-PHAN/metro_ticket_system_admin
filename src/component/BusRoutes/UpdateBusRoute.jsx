// import React, { useEffect, useState } from 'react';
// import { 
//   Card, CardContent, Typography, TextField, Button, 
//   Snackbar, Alert, Autocomplete, CircularProgress 
// } from '@mui/material';
// import { useParams, useNavigate } from 'react-router-dom';

// const UpdateBusRoute = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     id: '',
//     stationId: '',
//     destinationName: ''
//   });
//   const [stations, setStations] = useState([]);
//   const [stationsLoading, setStationsLoading] = useState(false);
//   const [selectedStation, setSelectedStation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch stations
//   useEffect(() => {
//     const fetchStations = async () => {
//       setStationsLoading(true);
//       try {
//         const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
//           headers: { 'Accept': 'application/json' }
//         });
//         const data = await res.json();
//         if (data.succeeded && data.data && data.data.stations) {
//           setStations(data.data.stations);
//         }
//       } catch (err) {
//         console.error('Error fetching stations:', err);
//       } finally {
//         setStationsLoading(false);
//       }
//     };
    
//     fetchStations();
//   }, []);

//   // Fetch bus route data
//   useEffect(() => {
//     const fetchBusRoute = async () => {
//       try {
//         const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Buses?currentPage=0', {
//           headers: { 'Accept': 'application/json' }
//         });
//         const data = await res.json();
//         const bus = (data.data.buses || []).find(b => b.id === id);
        
//         if (bus) {
//           setForm({
//             id: bus.id,
//             stationId: bus.stationId || '',
//             destinationName: bus.destinationName || ''
//           });
          
//           // Tìm station tương ứng để set vào selectedStation
//           if (bus.stationId && stations.length > 0) {
//             const station = stations.find(s => s.id === bus.stationId);
//             setSelectedStation(station || null);
//           }
//         } else {
//           setError('Không tìm thấy tuyến xe buýt!');
//         }
//       } catch (err) {
//         setError('Lỗi khi tải dữ liệu!');
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Chỉ fetch bus route khi đã có stations
//     if (stations.length > 0) {
//       fetchBusRoute();
//     }
//   }, [id, stations]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleStationChange = (event, newValue) => {
//     setSelectedStation(newValue);
//     setForm({ ...form, stationId: newValue ? newValue.id : '' });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!form.stationId) {
//       setError('Vui lòng chọn ga Metro');
//       return;
//     }
    
//     try {
//       const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Buses', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({
//           id: form.id,
//           stationId: form.stationId,
//           destinationName: form.destinationName
//         })
//       });
//       if (!res.ok) {
//         const errMsg = await res.text();
//         setError('Không thể cập nhật tuyến xe buýt. ' + errMsg);
//         return;
//       }
//       setSuccess(true);
//       setTimeout(() => navigate('/bus-routes'), 1500);
//     } catch (err) {
//       setError('Không thể cập nhật tuyến xe buýt. Vui lòng thử lại!');
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Cập nhật tuyến xe buýt
//         </Typography>
//         <Button
//           variant="outlined"
//           color="secondary"
//           onClick={() => navigate('/bus-routes')}
//           sx={{ mb: 2 }}
//         >
//           Quay lại danh sách
//         </Button>
        
//         {loading ? (
//           <Typography>Đang tải...</Typography>
//         ) : error ? (
//           <Alert severity="error">{error}</Alert>
//         ) : (
//           <form onSubmit={handleUpdate}>
//             <Autocomplete
//               options={stations}
//               getOptionLabel={(option) => `${option.name} (${option.code})`}
//               value={selectedStation}
//               onChange={handleStationChange}
//               loading={stationsLoading}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Chọn ga Metro"
//                   margin="normal"
//                   required
//                   fullWidth
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {stationsLoading ? <CircularProgress color="inherit" size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//             />
//             <TextField
//               label="Tên điểm đến"
//               name="destinationName"
//               value={form.destinationName}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               required
//               placeholder="Ví dụ: Chợ Bến Thành, Công viên Tao Đàn..."
//             />
//             <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//               Cập nhật
//             </Button>
//           </form>
//         )}
        
//         <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
//           <Alert severity="success" sx={{ width: '100%' }}>
//             Cập nhật tuyến xe buýt thành công!
//           </Alert>
//         </Snackbar>
//         <Snackbar open={!!error && !loading} autoHideDuration={3000} onClose={() => setError('')}>
//           <Alert severity="error" sx={{ width: '100%' }}>
//             {error}
//           </Alert>
//         </Snackbar>
//       </CardContent>
//     </Card>
//   );
// };

// export default UpdateBusRoute;








import React, { useEffect, useState } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Snackbar, Alert, Autocomplete, CircularProgress 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBusRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    stationId: '',
    destinationName: ''
  });
  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch stations
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

  // Fetch bus route data by ID
  useEffect(() => {
    const fetchBusRoute = async () => {
      try {
        // ✅ Fetch bus trực tiếp theo ID
        const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Buses/${id}`, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Không tìm thấy tuyến xe buýt!`);
        }
        
        const data = await res.json();
        console.log('Bus data:', data);
        
        // Kiểm tra response structure
        let bus = null;
        if (data.succeeded && data.data) {
          bus = data.data;
        } else if (data.id) {
          // Trường hợp API trả về trực tiếp object bus
          bus = data;
        }
        
        if (bus) {
          setForm({
            id: bus.id,
            stationId: bus.stationId || '',
            destinationName: bus.destinationName || ''
          });
          
          // Tìm station tương ứng để set vào selectedStation
          if (bus.stationId && stations.length > 0) {
            const station = stations.find(s => s.id === bus.stationId);
            setSelectedStation(station || null);
          }
        } else {
          setError('Không tìm thấy tuyến xe buýt!');
        }
      } catch (err) {
        console.error('Error fetching bus route:', err);
        setError('Lỗi khi tải dữ liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ fetch bus route khi đã có stations
    if (stations.length > 0) {
      fetchBusRoute();
    }
  }, [id, stations]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStationChange = (event, newValue) => {
    setSelectedStation(newValue);
    setForm({ ...form, stationId: newValue ? newValue.id : '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.stationId) {
      setError('Vui lòng chọn ga Metro');
      return;
    }
    
    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Buses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: form.id,
          stationId: form.stationId,
          destinationName: form.destinationName
        })
      });
      
      if (!res.ok) {
        const errMsg = await res.text();
        setError('Không thể cập nhật tuyến xe buýt. ' + errMsg);
        return;
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/bus-routes'), 1500);
    } catch (err) {
      setError('Không thể cập nhật tuyến xe buýt. Vui lòng thử lại!');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Cập nhật tuyến xe buýt
          </Typography>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !form.id) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Cập nhật tuyến xe buýt
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/bus-routes')}
            sx={{ mb: 2 }}
          >
            Quay lại danh sách
          </Button>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cập nhật tuyến xe buýt
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/bus-routes')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        
        <form onSubmit={handleUpdate}>
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
            Cập nhật
          </Button>
        </form>
        
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Cập nhật tuyến xe buýt thành công!
          </Alert>
        </Snackbar>
        <Snackbar open={!!error && form.id} autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UpdateBusRoute;
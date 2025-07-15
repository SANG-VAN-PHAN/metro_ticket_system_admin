// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, Box, Avatar } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { useNavigate } from 'react-router-dom';

// const UpdateRoute = () => {
//   const navigate = useNavigate();
//   const [routes, setRoutes] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [form, setForm] = useState({
//     code: '',
//     name: '',
//     thumbnailImageUrl: '',
//     lengthInKm: ''
//   });

//   // Lấy danh sách tuyến từ API
//   useEffect(() => {
//     fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(res => res.json())
//       .then(data => setRoutes(data.data.routes || []));
//   }, []);

//   const handleOpen = (route) => {
//     setSelected(route);
//     setForm({
//       code: route.code,
//       name: route.name,
//       thumbnailImageUrl: route.thumbnailImageUrl,
//       lengthInKm: route.lengthInKm
//     });
//     setImagePreview(route.thumbnailImageUrl === 'empty' ? '' : route.thumbnailImageUrl);
//     setImageFile(null);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelected(null);
//     setImageFile(null);
//     setImagePreview('');
//     setForm({
//       code: '',
//       name: '',
//       thumbnailImageUrl: '',
//       lengthInKm: ''
//     });
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onload = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Gửi cập nhật lên API
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!selected) return;

//     try {
//       const formData = new FormData();
//       formData.append('id', selected.id);
//       formData.append('code', form.code);
//       formData.append('name', form.name);
//       formData.append('lengthInKm', form.lengthInKm);
      
//       if (imageFile) {
//         formData.append('ThumbnailImage', imageFile);
//       } else {
//         formData.append('thumbnailImageUrl', form.thumbnailImageUrl || 'empty');
//       }

//       const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/routes`, {
//         method: 'PUT',
//         headers: {
//           'Accept': 'application/json'
//         },
//         body: formData
//       });
      
//       if (!res.ok) throw new Error('Lỗi khi cập nhật tuyến!');
      
//       // Reload data
//       const updatedRes = await fetch('https://api.metroticketingsystem.site/api/catalog/routes', {
//         headers: { 'Accept': 'application/json' }
//       });
//       const updatedData = await updatedRes.json();
//       setRoutes(updatedData.data.routes || []);
      
//       setSuccess(true);
//       handleClose();
//     } catch (err) {
//       alert('Không thể cập nhật tuyến. Vui lòng thử lại!');
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Cập nhật tuyến Metro
//         </Typography>
//         <Button
//           variant="outlined"
//           color="secondary"
//           onClick={() => navigate('/metro-routes')}
//           sx={{ mb: 2 }}
//         >
//           Quay lại danh sách
//         </Button>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Mã tuyến</TableCell>
//                 <TableCell>Tên tuyến</TableCell>
//                 <TableCell>Ảnh đại diện</TableCell>
//                 <TableCell>Chiều dài (km)</TableCell>
//                 <TableCell>Hành động</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {routes.map((route) => (
//                 <TableRow key={route.id}>
//                   <TableCell>{route.code}</TableCell>
//                   <TableCell>{route.name}</TableCell>
//                   <TableCell>
//                     {route.thumbnailImageUrl && route.thumbnailImageUrl !== 'empty' ? (
//                       <Avatar src={route.thumbnailImageUrl} alt={route.name} />
//                     ) : (
//                       <Avatar>{route.name?.[0] || '?'}</Avatar>
//                     )}
//                   </TableCell>
//                   <TableCell>{route.lengthInKm}</TableCell>
//                   <TableCell>
//                     <IconButton color="primary" onClick={() => handleOpen(route)}>
//                       <EditIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//           <DialogTitle>Cập nhật tuyến Metro</DialogTitle>
//           <form onSubmit={handleUpdate}>
//             <DialogContent>
//               <TextField
//                 label="Mã tuyến"
//                 name="code"
//                 value={form.code}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 required
//               />
//               <TextField
//                 label="Tên tuyến"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 required
//               />
              
//               {/* Upload ảnh */}
//               <Box sx={{ mt: 2 }}>
//                 <Button
//                   component="label"
//                   variant="outlined"
//                   startIcon={<CloudUploadIcon />}
//                   fullWidth
//                 >
//                   Chọn ảnh tuyến
//                   <input
//                     type="file"
//                     hidden
//                     accept="image/*"
//                     onChange={handleImageChange}
//                   />
//                 </Button>
//                 {imagePreview && (
//                   <Box mt={2} textAlign="center">
//                     <Avatar
//                       src={imagePreview}
//                       alt="Preview"
//                       sx={{ width: 80, height: 80, mx: 'auto' }}
//                       variant="rounded"
//                     />
//                   </Box>
//                 )}
//               </Box>

//               <TextField
//                 label="Chiều dài (km)"
//                 name="lengthInKm"
//                 type="number"
//                 value={form.lengthInKm}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 required
//                 inputProps={{ min: 0, step: 0.01 }}
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleClose}>Hủy</Button>
//               <Button type="submit" variant="contained">
//                 Cập nhật
//               </Button>
//             </DialogActions>
//           </form>
//         </Dialog>
        
//         <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
//           <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
//             Cập nhật tuyến thành công!
//           </Alert>
//         </Snackbar>
//       </CardContent>
//     </Card>
//   );
// };

// export default UpdateRoute;







import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, TextField, Button, 
  Snackbar, Alert, Box, Avatar, CircularProgress 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateRoute = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({
    code: '',
    name: '',
    thumbnailImageUrl: '',
    lengthInKm: ''
  });

  // Fetch route data by ID
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // ✅ Fetch route trực tiếp theo ID
        const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Routes/${id}`, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Không tìm thấy tuyến Metro!`);
        }
        
        const data = await res.json();
        console.log('Route data:', data);
        
        // Kiểm tra response structure
        let routeData = null;
        if (data.succeeded && data.data) {
          routeData = data.data;
        } else if (data.id) {
          // Trường hợp API trả về trực tiếp object route
          routeData = data;
        }
        
        if (routeData) {
          setRoute(routeData);
          setForm({
            code: routeData.code || '',
            name: routeData.name || '',
            thumbnailImageUrl: routeData.thumbnailImageUrl || '',
            lengthInKm: routeData.lengthInKm || ''
          });
          setImagePreview(routeData.thumbnailImageUrl === 'empty' ? '' : (routeData.thumbnailImageUrl || ''));
        } else {
          setError('Không tìm thấy tuyến Metro!');
        }
      } catch (err) {
        console.error('Error fetching route:', err);
        setError('Lỗi khi tải dữ liệu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoute();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!route) return;

    try {
      const formData = new FormData();
      formData.append('id', route.id);
      formData.append('code', form.code);
      formData.append('name', form.name);
      formData.append('lengthInKm', form.lengthInKm);
      
      if (imageFile) {
        formData.append('ThumbnailImage', imageFile);
      } else {
        formData.append('thumbnailImageUrl', form.thumbnailImageUrl || 'empty');
      }

      const res = await fetch(`https://api.metroticketingsystem.site/api/catalog/Routes`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Không thể cập nhật tuyến: ' + errorText);
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/metro-routes'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      setError('Không thể cập nhật tuyến. Vui lòng thử lại!');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Cập nhật tuyến Metro
          </Typography>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !route) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Cập nhật tuyến Metro
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/metro-routes')}
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
          Cập nhật tuyến Metro
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/metro-routes')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        
        <form onSubmit={handleUpdate}>
          <TextField
            label="Mã tuyến"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled
          />
          <TextField
            label="Tên tuyến"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          {/* Upload ảnh */}
          <Box sx={{ mt: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Chọn ảnh tuyến
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {imagePreview && (
              <Box mt={2} textAlign="center">
                <Avatar
                  src={imagePreview}
                  alt="Preview"
                  sx={{ width: 80, height: 80, mx: 'auto' }}
                  variant="rounded"
                />
              </Box>
            )}
          </Box>

          <TextField
            label="Chiều dài (km)"
            name="lengthInKm"
            type="number"
            value={form.lengthInKm}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            sx={{ mt: 2 }}
          >
            Cập nhật
          </Button>
        </form>
        
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Cập nhật tuyến thành công!
          </Alert>
        </Snackbar>
        
        <Snackbar open={!!error && route} autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UpdateRoute;
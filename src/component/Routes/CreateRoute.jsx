// import React, { useState } from 'react';
// import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
// import { v4 as uuidv4 } from 'uuid';
// import { useNavigate } from 'react-router-dom';

// const CreateRoute = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     code: '',
//     name: '',
//     lengthInKm: ''
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!form.name) {
//       setError('Vui lòng nhập đầy đủ thông tin bắt buộc!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('id', uuidv4());
//     formData.append('code', form.code);
//     formData.append('name', form.name);
//     formData.append('lengthInKm', form.lengthInKm);
//     if (selectedFile) {
//       formData.append('thumbnailImage', selectedFile);
//     }

//     try {
//       const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Routes', {
//         method: 'POST',
//         body: formData
//       });
//       if (!res.ok) throw new Error('Lỗi khi thêm tuyến!');
//       setOpen(true);
//       setForm({
//         code: '',
//         name: '',
//         lengthInKm: ''
//       });
//       setSelectedFile(null);
//     } catch (err) {
//       setError('Không thể thêm tuyến. Vui lòng thử lại!');
//     }
//   };

//   const handleClose = () => setOpen(false);

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Thêm tuyến Metro mới
//         </Typography>
//         <Button
//           variant="outlined"
//           color="secondary"
//           onClick={() => navigate('/metro-routes')}
//           sx={{ mb: 2 }}
//         >
//           Quay lại danh sách
//         </Button>
//         <form onSubmit={handleSubmit}>
//           {/* <TextField
//             label="Mã tuyến (Code)"
//             name="code"
//             value={form.code}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           /> */}
//           <TextField
//             label="Tên tuyến (Name)"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <Button
//             variant="outlined"
//             component="label"
//             sx={{ mt: 2, mb: 2 }}
//           >
//             {selectedFile ? selectedFile.name : "Chọn ảnh đại diện"}
//             <input
//               type="file"
//               accept="image/*"
//               hidden
//               onChange={handleFileChange}
//             />
//           </Button>
//           {/* <TextField
//             label="Chiều dài (km)"
//             name="lengthInKm"
//             type="number"
//             value={form.lengthInKm}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//             inputProps={{ min: 0, step: 0.01 }}
//           /> */}
//           <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//             Thêm tuyến
//           </Button>
//         </form>
//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}
//         <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
//           <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
//             Thêm tuyến thành công!
//           </Alert>
//         </Snackbar>
//       </CardContent>
//     </Card>
//   );
// };

// export default CreateRoute;



import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const CreateRoute = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên tuyến!');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('id', uuidv4());
    formData.append('name', form.name);
    formData.append('code', ''); // Để trống
    formData.append('lengthInKm', '0'); // Default 0
    
    if (selectedFile) {
      formData.append('thumbnailImage', selectedFile);
    }

    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Routes', {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', res.status); // Debug log
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Error response:', errorText); // Debug log
        throw new Error(errorText || 'Lỗi khi thêm tuyến!');
      }
      
      setOpen(true);
      setForm({ name: '' });
      setSelectedFile(null);
      
      // Auto navigate sau 1.5s
      setTimeout(() => navigate('/metro-routes'), 1500);
      
    } catch (err) {
      console.error('Create route error:', err); // Debug log
      setError(err.message || 'Không thể thêm tuyến. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm tuyến Metro mới
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/metro-routes')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên tuyến"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            placeholder="Nhập tên tuyến metro"
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2, mb: 2, display: 'block' }}
          >
            {selectedFile ? selectedFile.name : "Chọn ảnh đại diện (tùy chọn)"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Thêm tuyến'}
          </Button>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Thêm tuyến thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateRoute;
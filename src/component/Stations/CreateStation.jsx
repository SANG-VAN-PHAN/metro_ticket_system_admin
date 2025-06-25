// import React, { useState } from 'react';
// import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
// import { v4 as uuidv4 } from 'uuid';
// import { useNavigate } from 'react-router-dom';

// const CreateStation = () => {
//   const [form, setForm] = useState({
//     name: '',
//     code: '',
//     streetNumber: '',
//     street: '',
//     ward: '',
//     district: '',
//     city: '',
//     thumbnailImageUrl: ''
//   });
//   const [file, setFile] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let imageUrl = '';
//       if (file) {
//         const formData = new FormData();
//         formData.append('file', file);
//         // Thay endpoint này bằng endpoint upload ảnh thực tế của bạn
//         const uploadRes = await fetch('https://api.metroticketingsystem.site/api/upload', {
//           method: 'POST',
//           body: formData
//         });
//         if (!uploadRes.ok) throw new Error('Lỗi upload ảnh!');
//         const uploadData = await uploadRes.json();
//         imageUrl = uploadData.url || uploadData.data?.url || '';
//       }

//       const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Accept': 'application/json'
//         },
//         body: new URLSearchParams({
//           id: uuidv4(),
//           name: form.name,
//           code: form.code,
//           streetNumber: form.streetNumber,
//           street: form.street,
//           ward: form.ward,
//           district: form.district,
//           city: form.city,
//           thumbnailImageUrl: imageUrl || 'empty'
//         }).toString()
//       });
//       if (!res.ok) throw new Error('Lỗi khi tạo nhà ga!');
//       setSuccess(true);
//       setTimeout(() => navigate('/stations'), 1500);
//     } catch (err) {
//       setError('Không thể tạo nhà ga. Vui lòng thử lại!');
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Thêm nhà ga mới
//         </Typography>
//         <Button
//           variant="outlined"
//           color="secondary"
//           onClick={() => navigate('/stations')}
//           sx={{ mb: 2 }}
//         >
//           Quay lại danh sách
//         </Button>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Tên ga"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Mã ga"
//             name="code"
//             value={form.code}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Đường số"
//             name="streetNumber"
//             value={form.streetNumber}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Tên đường"
//             name="street"
//             value={form.street}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Phường"
//             name="ward"
//             value={form.ward}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Quận"
//             name="district"
//             value={form.district}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Thành phố"
//             name="city"
//             value={form.city}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           {/* Thay TextField nhập URL bằng input file */}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{ margin: '16px 0', display: 'block' }}
//           />
//           <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//             Thêm nhà ga
//           </Button>
//         </form>
//         <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
//           <Alert severity="success" sx={{ width: '100%' }}>
//             Thêm nhà ga thành công!
//           </Alert>
//         </Snackbar>
//         <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
//           <Alert severity="error" sx={{ width: '100%' }}>
//             {error}
//           </Alert>
//         </Snackbar>
//       </CardContent>
//     </Card>
//   );
// };

// export default CreateStation;

import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const CreateStation = () => {
  const [form, setForm] = useState({
    name: '',
    code: '',
    streetNumber: '',
    street: '',
    ward: '',
    district: '',
    city: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.code) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }

    const formData = new FormData();
    formData.append('id', uuidv4());
    formData.append('name', form.name);
    formData.append('code', form.code);
    formData.append('streetNumber', form.streetNumber);
    formData.append('street', form.street);
    formData.append('ward', form.ward);
    formData.append('district', form.district);
    formData.append('city', form.city);
    if (selectedFile) {
      formData.append('thumbnailImage', selectedFile);
    }

    try {
      const res = await fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Lỗi khi tạo nhà ga!');
      setSuccess(true);
      setForm({
        name: '',
        code: '',
        streetNumber: '',
        street: '',
        ward: '',
        district: '',
        city: ''
      });
      setSelectedFile(null);
      setTimeout(() => navigate('/stations'), 1500);
    } catch (err) {
      setError('Không thể tạo nhà ga. Vui lòng thử lại!');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Thêm nhà ga mới
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/stations')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </Button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên ga"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mã ga"
            name="code"
            value={form.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Đường số"
            name="streetNumber"
            value={form.streetNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên đường"
            name="street"
            value={form.street}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phường"
            name="ward"
            value={form.ward}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quận"
            name="district"
            value={form.district}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Thành phố"
            name="city"
            value={form.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2, mb: 2 }}
          >
            {selectedFile ? selectedFile.name : "Chọn ảnh đại diện"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm nhà ga
          </Button>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Thêm nhà ga thành công!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default CreateStation;
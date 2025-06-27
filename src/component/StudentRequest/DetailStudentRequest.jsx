// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Box, Typography, Paper, Avatar, CircularProgress, Alert, Grid, Button, Stack, TextField
// } from '@mui/material';

// const DetailStudentRequest = () => {
//   const { id } = useParams();
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [actionLoading, setActionLoading] = useState(false);
//   const [success, setSuccess] = useState('');
//   const [editMode, setEditMode] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const fetchDetail = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/${id}`);
//         if (!res.ok) throw new Error('Không thể lấy thông tin chi tiết!');
//         const data = await res.json();
//         setStudent(data.data || null);
//       } catch (err) {
//         setError(err.message || 'Có lỗi xảy ra!');
//       }
//       setLoading(false);
//     };
//     fetchDetail();
//   }, [id]);

//   const handleEdit = () => {
//     setEditForm({
//       studentCode: student.studentCode || '',
//       studentEmail: student.studentEmail || '',
//       schoolName: student.schoolName || '',
//       firstName: student.fullName?.firstName || '',
//       lastName: student.fullName?.lastName || '',
//       dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : '',
//       status: student.status || ''
//     });
//     setEditMode(true);
//     setSuccess('');
//     setError('');
//   };

//   const handleChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     setSuccess('');
//     try {
//       const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           studentCode: editForm.studentCode,
//           studentEmail: editForm.studentEmail,
//           schoolName: editForm.schoolName,
//           fullName: {
//             firstName: editForm.firstName,
//             lastName: editForm.lastName
//           },
//           dateOfBirth: editForm.dateOfBirth,
//           status: editForm.status
//         })
//       });
//       if (!res.ok) throw new Error('Cập nhật thất bại!');
//       const data = await res.json();
//       setStudent(data.data || { ...student, ...editForm, fullName: { lastName: editForm.lastName, firstName: editForm.firstName } });
//       setEditMode(false);
//       setSuccess('Cập nhật thành công!');
//     } catch (err) {
//       setError(err.message || 'Có lỗi khi cập nhật!');
//     }
//     setSaving(false);
//   };

//   const handleApprove = async () => {
//     setActionLoading(true);
//     setError('');
//     setSuccess('');
//     try {
//       const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/Approve/${id}`, {
//         method: 'PUT'
//       });
//       if (!res.ok) throw new Error('Duyệt thất bại!');
//       setStudent((prev) => ({ ...prev, status: 'Approved' }));
//       setSuccess('Đã duyệt yêu cầu!');
//     } catch (err) {
//       setError(err.message || 'Có lỗi khi duyệt!');
//     }
//     setActionLoading(false);
//   };

//   const handleDecline = async () => {
//     setActionLoading(true);
//     setError('');
//     setSuccess('');
//     try {
//       const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/Declined/${id}`, {
//         method: 'PUT'
//       });
//       if (!res.ok) throw new Error('Từ chối thất bại!');
//       setStudent((prev) => ({ ...prev, status: 'Declined' }));
//       setSuccess('Đã từ chối yêu cầu!');
//     } catch (err) {
//       setError(err.message || 'Có lỗi khi từ chối!');
//     }
//     setActionLoading(false);
//   };

//   if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
//   if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
//   if (!student) return <Alert severity="info" sx={{ mt: 4 }}>Không tìm thấy yêu cầu sinh viên.</Alert>;

//   return (
//     <Box maxWidth={600} mx="auto" mt={5}>
//       <Paper sx={{ p: 3 }}>
//         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h5">
//             Chi tiết yêu cầu xác thực sinh viên
//           </Typography>
//           {!editMode && (
//             <Button variant="contained" onClick={handleEdit}>
//               Edit
//             </Button>
//           )}
//         </Stack>
//         {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
//         {editMode ? (
//           <form onSubmit={handleSave}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={4}>
//                 <Avatar
//                   src={student.studentCardImageUrl}
//                   alt={student.studentCode}
//                   variant="rounded"
//                   sx={{ width: 120, height: 120, mb: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={8}>
//                 <TextField
//                   label="Mã sinh viên"
//                   name="studentCode"
//                   value={editForm.studentCode}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   label="Email"
//                   name="studentEmail"
//                   value={editForm.studentEmail}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   label="Họ"
//                   name="lastName"
//                   value={editForm.lastName}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   label="Tên"
//                   name="firstName"
//                   value={editForm.firstName}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   label="Trường"
//                   name="schoolName"
//                   value={editForm.schoolName}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//                 <TextField
//                   label="Ngày sinh"
//                   name="dateOfBirth"
//                   type="date"
//                   value={editForm.dateOfBirth}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   InputLabelProps={{ shrink: true }}
//                   required
//                 />
//                 <TextField
//                   label="Trạng thái"
//                   name="status"
//                   value={editForm.status}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                 />
//               </Grid>
//             </Grid>
//             <Stack direction="row" spacing={2} mt={3}>
//               <Button type="submit" variant="contained" color="primary" disabled={saving}>
//                 Lưu
//               </Button>
//               <Button variant="outlined" onClick={() => setEditMode(false)} disabled={saving}>
//                 Hủy
//               </Button>
//             </Stack>
//             {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//           </form>
//         ) : (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <Avatar
//                 src={student.studentCardImageUrl}
//                 alt={student.studentCode}
//                 variant="rounded"
//                 sx={{ width: 120, height: 120, mb: 2 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={8}>
//               <Typography><b>Mã sinh viên:</b> {student.studentCode}</Typography>
//               <Typography><b>Email:</b> {student.studentEmail}</Typography>
//               <Typography><b>Họ tên:</b> {student.fullName ? `${student.fullName.lastName} ${student.fullName.firstName}` : ''}</Typography>
//               <Typography><b>Trường:</b> {student.schoolName}</Typography>
//               <Typography><b>Ngày sinh:</b> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : ''}</Typography>
//               <Typography><b>Trạng thái:</b> {student.status}</Typography>
//               {student.status === 'Pending' && (
//                 <Stack direction="row" spacing={2} mt={2}>
//                   <Button
//                     variant="contained"
//                     color="success"
//                     onClick={handleApprove}
//                     disabled={actionLoading}
//                   >
//                     Duyệt
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={handleDecline}
//                     disabled={actionLoading}
//                   >
//                     Từ chối
//                   </Button>
//                 </Stack>
//               )}
//               {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//             </Grid>
//           </Grid>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default DetailStudentRequest;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box, Typography, Paper, Avatar, CircularProgress, Alert, Grid, Button, Stack
} from '@mui/material';

const DetailStudentRequest = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/${id}`);
        if (!res.ok) throw new Error('Không thể lấy thông tin chi tiết!');
        const data = await res.json();
        setStudent(data.data || null);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra!');
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/Approve/${id}`, {
        method: 'PUT'
      });
      if (!res.ok) throw new Error('Duyệt thất bại!');
      setStudent((prev) => ({ ...prev, status: 'Approved' }));
      setSuccess('Đã duyệt yêu cầu!');
    } catch (err) {
      setError(err.message || 'Có lỗi khi duyệt!');
    }
    setActionLoading(false);
  };

  const handleDecline = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`https://api.metroticketingsystem.site/api/user/StudentRequest/Declined/${id}`, {
        method: 'PUT'
      });
      if (!res.ok) throw new Error('Từ chối thất bại!');
      setStudent((prev) => ({ ...prev, status: 'Declined' }));
      setSuccess('Đã từ chối yêu cầu!');
    } catch (err) {
      setError(err.message || 'Có lỗi khi từ chối!');
    }
    setActionLoading(false);
  };

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!student) return <Alert severity="info" sx={{ mt: 4 }}>Không tìm thấy yêu cầu sinh viên.</Alert>;

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Chi tiết yêu cầu xác thực sinh viên
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Avatar
              src={student.studentCardImageUrl}
              alt={student.studentCode}
              variant="rounded"
              sx={{ width: 120, height: 120, mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography><b>Mã sinh viên:</b> {student.studentCode}</Typography>
            <Typography><b>Email:</b> {student.studentEmail}</Typography>
            <Typography><b>Họ tên:</b> {student.fullName ? `${student.fullName.lastName} ${student.fullName.firstName}` : ''}</Typography>
            <Typography><b>Trường:</b> {student.schoolName}</Typography>
            <Typography><b>Ngày sinh:</b> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : ''}</Typography>
            <Typography><b>Trạng thái:</b> {student.status}</Typography>
            {student.status === 'Pending' && (
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  Duyệt
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDecline}
                  disabled={actionLoading}
                >
                  Từ chối
                </Button>
              </Stack>
            )}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Grid>
        </Grid>
        
        {/* Nút quay lại */}
        <Stack direction="row" justifyContent="flex-start" mt={3}>
          <Button 
            component={Link} 
            to="/student-request" 
            variant="outlined"
          >
            Quay lại danh sách
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DetailStudentRequest;
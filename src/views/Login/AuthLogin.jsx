import React from 'react';
// import jwt_decode from "jwt-decode"; phiên bản cũ
import { jwtDecode } from "jwt-decode"; // ✅ ĐÚNG với phiên bản mới

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Select,
  MenuItem
} from '@mui/material';

//  third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/social-google.svg';
import { useNavigate } from 'react-router-dom';

const AuthLogin = ({ ...rest }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [role, setRole] = React.useState('Administrator'); // Mặc định là Administrator
  const navigate = useNavigate();

  // Nếu đã đăng nhập thì redirect
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('user-token: ', token);

    if (token) {
      // alert('Bạn đã đăng nhập tài khoản rồi!');
      navigate('/'); // hoặc navigate tới trang dashboard
    }
  }, [navigate]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Button
            fullWidth={true}
            sx={{
              fontSize: { md: '1rem', xs: '0.875rem' },
              fontWeight: 500,
              backgroundColor: theme.palette.grey[50],
              color: theme.palette.grey[600],
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: theme.palette.grey[100]
              }
            }}
            size="large"
            variant="contained"
          >
            <img
              src={Google}
              alt="google"
              width="20px"
              style={{
                marginRight: '16px',
                '@media (maxWidth:899.95px)': {
                  marginRight: '8px'
                }
              }}
            />{' '}
            Sign in with Google
          </Button>
        </Grid>
      </Grid>

      <Box alignItems="center" display="flex" mt={2}>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
        <Typography color="textSecondary" variant="h5" sx={{ m: theme.spacing(2) }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
      </Box>

      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setError('');
          try {
            const res = await fetch(`https://api.metroticketingsystem.site/api/user/Auth/${role}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                email: values.email,
                password: values.password
              })
            });
            // if (!res.ok) {
            //   const errMsg = await res.text();
            //   setErrors({ submit: 'Đăng nhập thất bại. ' + errMsg });
            //   setError('Đăng nhập thất bại. ' + errMsg);
            //   setSubmitting(false);
            //   return;
            // }

            if (!res.ok) {
  let errorMessage = 'Đăng nhập thất bại';
  
  try {
    const errorText = await res.text();
    // Kiểm tra xem có phải JSON không
    if (errorText.startsWith('{')) {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } else {
      errorMessage = errorText || errorMessage;
    }
  } catch (parseError) {
    errorMessage = 'Email hoặc mật khẩu không chính xác!';
  }
  
  setErrors({ submit: errorMessage });
  setError(errorMessage);
  setSubmitting(false);
  return;
}
            const data = await res.json();
            const decoded = jwtDecode(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(decoded));
            localStorage.setItem('role', decoded.roles); 
            // window.location.reload();
            console.log('Login successful:', decoded);
            console.log('Token saved:', data.token);
            console.log('user-role: ', decoded.roles);

            setSuccess(true);
            // setTimeout(() => navigate('/'), 1500);
            setTimeout(() => {
  navigate('/', { 
    replace: true,
    state: { forceRefresh: true }
  });
  // Force re-render menu
  // window.location.reload();
}, 1000);
          } catch (err) {
            setErrors({ submit: 'Không thể đăng nhập. Vui lòng thử lại!' });
            setError('Không thể đăng nhập. Vui lòng thử lại!');
          }
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="Administrator">Administrator</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
              </Select>
            </FormControl>

            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address / Username"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text">
                  {' '}
                  {errors.password}{' '}
                </FormHelperText>
              )}
            </FormControl>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="subtitle2" color="primary" sx={{ textDecoration: 'none' }}>
                  Forgot Password?
                </Typography>
              </Grid>
            </Grid>

            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

             <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Đăng nhập thành công!
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthLogin;
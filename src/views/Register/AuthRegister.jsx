import React from 'react';
import { Link } from 'react-router-dom';

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
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/social-google.svg';
import { useNavigate } from 'react-router-dom';

const AuthRegister = ({ ...rest }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  // Nếu đã đăng ký thì redirect
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      alert('Bạn đã đăng nhập tài khoản rồi!');
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
                '@media (maxWidth:900px)': {
                  marginRight: '8px'
                }
              }}
            />{' '}
            Register with Google
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
          firstName: '',
          lastName: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          firstName: Yup.string().max(255).required('First name is required'),
          lastName: Yup.string().max(255).required('Last name is required')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setError('');
          try {
            const res = await fetch('https://api.metroticketingsystem.site/api/user/Auth/register/customer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName
                })
            });
            if (!res.ok) {
              const data = await res.json();
              setErrors({ submit: data.message || 'Đăng ký thất bại.' });
              setError(data.message || 'Đăng ký thất bại.');
              setSubmitting(false);
              return;
            }
            setSuccess(true);
            setTimeout(() => navigate('/application/login'), 1500);
          } catch (err) {
            setErrors({ submit: 'Không thể đăng ký. Vui lòng thử lại!' });
            setError('Không thể đăng ký. Vui lòng thử lại!');
          }
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <TextField
              error={Boolean(touched.firstName && errors.firstName)}
              fullWidth
              helperText={touched.firstName && errors.firstName}
              label="First Name"
              margin="normal"
              name="firstName"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              variant="outlined"
              />
            <TextField
              error={Boolean(touched.lastName && errors.lastName)}
              fullWidth
              helperText={touched.lastName && errors.lastName}
              label="Last Name"
              margin="normal"
              name="lastName"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.lastName}
              variant="outlined"
            />
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

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}
              variant="outlined"
            >
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

            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box my={0}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label={
                  <>
                    I have read the &nbsp;
                    <Link to="#">Terms and Conditions </Link>
                  </>
                }
              />
            </Box>
            <Box mt={2}>
              <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Register
              </Button>
            </Box>
            </form>
        )}
      </Formik>
      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Đăng ký thành công!
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

export default AuthRegister;
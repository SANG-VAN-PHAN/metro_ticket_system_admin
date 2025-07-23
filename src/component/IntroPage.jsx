import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import mrtBanner from '../assets/images/mrt_train_banner.svg';

const IntroPage = () => (
  <Box maxWidth={700} mx="auto" mt={8}>
    <Card elevation={4} sx={{ borderRadius: 4, p: 3 }}>
      <CardContent>
        <Stack direction="column" alignItems="center" spacing={3}>
          <img src={mrtBanner} alt="Metro Ticket System" style={{ width: 180, marginBottom: 8 }} />
          <Typography variant="h3" fontWeight={700} color="primary.main" align="center">
            Metro Ticket System Admin
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center">
            Hệ thống quản trị vé metro giúp quản lý tuyến đường, nhân viên, khách hàng, vé, giao dịch và xác thực sinh viên một cách hiệu quả, hiện đại và an toàn.
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Chào mừng bạn đến với trang quản trị! Sử dụng menu bên trái để truy cập các chức năng quản lý hệ thống metro.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  </Box>
);

export default IntroPage; 
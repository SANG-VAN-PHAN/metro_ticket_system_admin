import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi feedback tại đây (gửi API hoặc lưu local)
    setOpen(true);
    setFeedback('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Góp ý & Phản hồi
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nhập góp ý của bạn"
            multiline
            rows={4}
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" disabled={!feedback}>
            Gửi góp ý
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Cảm ơn bạn đã gửi góp ý!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default Feedback;
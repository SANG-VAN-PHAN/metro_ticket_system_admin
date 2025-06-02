import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper } from '@mui/material';

const transactions = [
  {
    id: 1,
    code: 'GD001',
    user: 'Nguyễn Văn A',
    amount: 50000,
    type: 'Nạp tiền',
    date: '2024-06-01',
    status: 'Thành công'
  },
  {
    id: 2,
    code: 'GD002',
    user: 'Trần Thị B',
    amount: 15000,
    type: 'Mua vé',
    date: '2024-06-02',
    status: 'Thành công'
  },
  {
    id: 3,
    code: 'GD003',
    user: 'Lê Văn C',
    amount: 20000,
    type: 'Hoàn tiền',
    date: '2024-06-03',
    status: 'Thất bại'
  }
];

const statusColor = (status) => {
  switch (status) {
    case 'Thành công':
      return 'success';
    case 'Thất bại':
      return 'error';
    default:
      return 'default';
  }
};

const TransactionHistory = () => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Lịch sử giao dịch
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã giao dịch</TableCell>
              <TableCell>Người dùng</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Loại giao dịch</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tran) => (
              <TableRow key={tran.id}>
                <TableCell>{tran.code}</TableCell>
                <TableCell>{tran.user}</TableCell>
                <TableCell>{tran.amount.toLocaleString()} đ</TableCell>
                <TableCell>{tran.type}</TableCell>
                <TableCell>{tran.date}</TableCell>
                <TableCell>
                  <Chip label={tran.status} color={statusColor(tran.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody> 
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);
export default TransactionHistory;
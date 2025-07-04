// import React, { useEffect, useState } from 'react';
// import {
//   Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Stack, CircularProgress
// } from '@mui/material';

// // Hàm format số tiền với 2 số sau dấu phẩy
// const formatPrice = (value) => {
//   if (value === null || value === undefined) return '0.00';
//   return Number(value).toFixed(2);
// };

// const ViewTickets = () => {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('https://api.metroticketingsystem.site/api/catalog/Tickets')
//       .then(res => res.json())
//       .then(data => {
//         setTickets(data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) return <CircularProgress />;

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Danh sách vé
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Tên vé</TableCell>
//                 <TableCell>Thời hạn (ngày)</TableCell>
//                 <TableCell>Giá (VNĐ)</TableCell>
//                 <TableCell>Loại vé</TableCell>
//                 <TableCell>Hiệu lực (ngày)</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tickets.map((ticket) => (
//                 <TableRow key={ticket.id}>
//                   <TableCell>{ticket.name}</TableCell>
//                   <TableCell>{ticket.expirationInDay}</TableCell>
//                   <TableCell>{formatPrice(ticket.price)}</TableCell>
//                   <TableCell>{ticket.ticketType}</TableCell>
//                   <TableCell>{ticket.activeInDay}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </CardContent>
//     </Card>
//   );
// };

// export default ViewTickets;




import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, CircularProgress, Button
} from '@mui/material';
import { Link } from 'react-router-dom';

// Hàm format số tiền với 2 số sau dấu phẩy
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0.00';
  return Number(value).toFixed(2);
};

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.metroticketingsystem.site/api/catalog/Tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Danh sách vé
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên vé</TableCell>
                <TableCell>Thời hạn (ngày)</TableCell>
                <TableCell>Giá (VNĐ)</TableCell>
                <TableCell>Loại vé</TableCell>
                <TableCell>Hiệu lực (ngày)</TableCell>
                <TableCell>Chi tiết</TableCell> {/* Thêm cột Chi tiết */}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.name}</TableCell>
                  <TableCell>{ticket.expirationInDay}</TableCell>
                  <TableCell>{formatPrice(ticket.price)}</TableCell>
                  <TableCell>{ticket.ticketType}</TableCell>
                  <TableCell>{ticket.activeInDay}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/ticket/${ticket.id}`}
                      variant="outlined"
                      size="small"
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ViewTickets;
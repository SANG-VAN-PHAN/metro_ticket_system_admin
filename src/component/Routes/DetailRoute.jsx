// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
// Card, CardContent, Typography, Button, Stack, Chip, Paper, List, ListItem, ListItemText,
// CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
// } from '@mui/material';

// const statusColor = (status) => {
// switch (status) {
// case 'Đang hoạt động':
// return 'success';
// case 'Đang xây dựng':
// return 'warning';
// case 'Đang quy hoạch':
// return 'default';
// default:
// return 'default';
// }
// };

// const DetailRoute = () => {
// const { id } = useParams();
// const [route, setRoute] = useState(null);
// const [stations, setStations] = useState([]);
// const [loading, setLoading] = useState(true);

// // Dialog state
// const [openDialog, setOpenDialog] = useState(false);
// const [stationList, setStationList] = useState([]);
// const [selectedStationId, setSelectedStationId] = useState('');
// const [distance, setDistance] = useState('');

// // Lấy thông tin route và danh sách station của route
// useEffect(() => {
// fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
// headers: { 'Accept': 'application/json' }
// })
// .then(res => res.json())
// .then(data => {
// setRoute(data.data);
// setStations(data.data.stations || []);
// setLoading(false);
// })
// .catch(() => setLoading(false));
// }, [id]);

// // Lấy danh sách tất cả các station (dùng cho select)
// useEffect(() => {
// fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
// headers: { 'Accept': 'application/json' }
// })
// .then(res => res.json())
// .then(data => {
// setStationList(data.data.stations || []);
// });
// }, []);

// // Thêm station đã chọn vào tuyến
// const handleAddStation = async () => {
// if (!selectedStationId) return;
// try {
// // 1. Tạo stationRoutes mới cho route
// let stationRoutes = stations.map((st, idx) => ({
// stationId: st.id || st.stationId,
// routeId: id,
// order: idx + 1,
// distanceToNext:
// idx === stations.length - 1 && stations.length > 0
// ? (distance ? parseFloat(distance) : 0)
// : st.distanceToNext || 0
// }));

//   // Thêm station mới vào cuối, distanceToNext luôn là 0
//   stationRoutes.push({
//     stationId: selectedStationId,
//     routeId: id,
//     order: stations.length + 1,
//     distanceToNext: 0
//   });

//   // 2. Gọi API đúng endpoint và body
//   const resRoute = await fetch('https://api.metroticketingsystem.site/api/catalog/Routes/station-route', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     body: JSON.stringify({
//       route: {
//         routeId: id,
//         stationRoutes: stationRoutes
//       }
//     })
//   });
//   if (!resRoute.ok) throw new Error('Lỗi khi cập nhật tuyến!');

//   // Reload lại danh sách station trong tuyến
//   const addedStation = stationList.find(st => st.id === selectedStationId);
//   // setStations([
//   //   ...stations.map((st, idx) =>
//   //     idx === stations.length - 1 && stations.length > 0
//   //       ? { ...st, distanceToNext: distance ? parseFloat(distance) : 0 }
//   //       : st
//   //   ),
//   //   {
//   //     id: addedStation.id,
//   //     name: addedStation.name,
//   //     distanceToNext: 0
//   //   }
//   // ]);

//   fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
//   headers: { 'Accept': 'application/json' }
// })
//   .then(res => res.json())
//   .then(data => {
//     setRoute(data.data);
//     setStations(data.data.stations || []);
//     // setLoading(false);
//     console.log("Route station data:", data.data.stations);
//   });

//   setSelectedStationId('');
//   setDistance('');
//   setOpenDialog(false);
// } catch (err) {
//   alert('Không thể thêm nhà ga. Vui lòng thử lại!');
// }

// };

// if (loading) return <CircularProgress />;
// if (!route) {
// return (
// <Card>
// <CardContent>
// <Typography variant="h5" color="error">Không tìm thấy tuyến đường!</Typography>
// <Button component={Link} to="/metro-routes" variant="contained" sx={{ mt: 2 }}>
// Quay lại danh sách
// </Button>
// </CardContent>
// </Card>
// );
// }

// return (
// <Card>
// <CardContent>
// <Typography variant="h4" gutterBottom>
// Chi tiết tuyến Metro
// </Typography>
// <Typography variant="h6" gutterBottom>
// {route.name}
// </Typography>
// <Stack spacing={1} sx={{ mb: 2 }}>
// <Typography>Mã tuyến: <b>{route.code}</b></Typography>
// <Typography>Chiều dài: <b>{route.lengthInKm} km</b></Typography>
// <Typography component="span">
// Trạng thái: <Chip label={route.status || 'Chưa rõ'} color={statusColor(route.status)} />
// </Typography>
// </Stack>
// <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
// <Typography variant="subtitle1" sx={{ mt: 1 }}>
// Danh sách nhà ga:
// </Typography>
// <Button variant="contained" onClick={() => setOpenDialog(true)}>
// Thêm nhà ga
// </Button>
// </Stack>
// <Paper variant="outlined" sx={{ mb: 2 }}>
// <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
// {stations.map((station, index) => (
// <React.Fragment key={station.id || station.stationId || station.name}>
// {index > 0 && (
// <ListItem sx={{ pl: 6, pr: 6 }}>
// <Typography color="text.secondary" fontStyle="italic">
// Khoảng cách đến ga trước: {stations[index - 1]?.distanceToNext ?? 0} km
// </Typography>
// </ListItem>
// )}
// <ListItem>
// <ListItemText
//   primary={`${index + 1}. ${station.name || station.stationName}`}
// />
// </ListItem>
// </React.Fragment>
// ))}
// </List>
// </Paper>
// <Button component={Link} to="/metro-routes" variant="outlined">
// Quay lại danh sách
// </Button>

//     {/* Dialog thêm nhà ga */}
//     <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//       <DialogTitle>Thêm nhà ga vào tuyến</DialogTitle>
//       <DialogContent>
//         <TextField
//           select
//           label="Chọn nhà ga"
//           value={selectedStationId}
//           onChange={e => setSelectedStationId(e.target.value)}
//           fullWidth
//           margin="normal"
//           required
//         >
//           <MenuItem value="">-- Chọn nhà ga --</MenuItem>
//           {stationList
//             .filter(st => !stations.some(s => (s.id || s.stationId) === st.id))
//             .map(station => (
//               <MenuItem key={station.id} value={station.id}>
//                 {station.name} ({station.code})
//               </MenuItem>
//             ))}
//         </TextField>
//         {stations.length > 0 && (
//           <TextField
//             label="Khoảng cách từ ga trước (km)"
//             value={distance}
//             onChange={e => setDistance(e.target.value)}
//             type="number"
//             fullWidth
//             margin="normal"
//             inputProps={{ min: 0, step: 0.01 }}
//             required
//           />
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
//         <Button onClick={handleAddStation} variant="contained">Thêm</Button>
//       </DialogActions>
//     </Dialog>
//   </CardContent>
// </Card>

// );
// };

// export default DetailRoute;












// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//   Card, CardContent, Typography, Button, Stack, Chip, Paper, List, ListItem, ListItemText,
//   CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
// } from '@mui/material';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// const statusColor = (status) => {
//   switch (status) {
//     case 'Đang hoạt động':
//       return 'success';
//     case 'Đang xây dựng':
//       return 'warning';
//     case 'Đang quy hoạch':
//       return 'default';
//     default:
//       return 'default';
//   }
// };

// const DetailRoute = () => {
//   const { id } = useParams();
//   const [route, setRoute] = useState(null);
//   const [stations, setStations] = useState([]);
//   const [distances, setDistances] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Dialog state
//   const [openDialog, setOpenDialog] = useState(false);
//   const [stationList, setStationList] = useState([]);
//   const [selectedStationId, setSelectedStationId] = useState('');

//   // Lấy thông tin route và danh sách station của route
//   useEffect(() => {
//     fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setRoute(data.data);
//         setStations(data.data.stations || []);
//         setDistances((data.data.stations || []).map(st => st.distanceToNext || 0));
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   // Lấy danh sách tất cả các station (dùng cho select)
//   useEffect(() => {
//     fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
//       headers: { 'Accept': 'application/json' }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setStationList(data.data.stations || []);
//       });
//   }, []);

//   // Thêm station đã chọn vào cuối danh sách
//   const handleAddStation = () => {
//     if (!selectedStationId) return;
//     const addedStation = stationList.find(st => st.id === selectedStationId);
//     setStations([...stations, addedStation]);
//     setDistances([...distances, 0]);
//     setSelectedStationId('');
//     setOpenDialog(false);
//   };

//   // Xử lý kéo thả
//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const newStations = Array.from(stations);
//     const [removed] = newStations.splice(result.source.index, 1);
//     newStations.splice(result.destination.index, 0, removed);

//     const newDistances = Array.from(distances);
//     const [removedDist] = newDistances.splice(result.source.index, 1);
//     newDistances.splice(result.destination.index, 0, removedDist);

//     setStations(newStations);
//     setDistances(newDistances);
//   };

//   // Cập nhật khoảng cách
//   const handleDistanceChange = (idx, value) => {
//     const newDistances = [...distances];
//     newDistances[idx] = value;
//     setDistances(newDistances);
//   };

//   // Lưu thay đổi lên backend
//   const handleSave = async () => {
//     try {
//       const stationRoutes = stations.map((st, idx) => ({
//         stationId: st.id || st.stationId,
//         routeId: id,
//         order: idx + 1,
//         // distanceToNext: idx === 0 ? 0 : parseFloat(distances[idx]) || 0
//         // distanceToNext: idx === stations.length - 1 ? 0 : parseFloat(distances[idx + 1]) || 0
//         distanceToNext: idx === stations.length - 1 ? 0 : parseFloat(distances[idx]) || 0
//       }));

//       const resRoute = await fetch('https://api.metroticketingsystem.site/api/catalog/Routes/station-route', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({
//           route: {
//             routeId: id,
//             stationRoutes: stationRoutes
//           }
//         })
//       });
//       if (!resRoute.ok) throw new Error('Lỗi khi cập nhật tuyến!' + await resRoute.text());

//       // Reload lại danh sách station trong tuyến
//       fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
//         headers: { 'Accept': 'application/json' }
//       })
//         .then(res => res.json())
//         .then(data => {
//           setRoute(data.data);
//           setStations(data.data.stations || []);
//           setDistances((data.data.stations || []).map(st => st.distanceToNext || 0));
//         });

//       alert('Đã lưu thay đổi!');
//     } catch (err) {
//       alert('Không thể lưu thay đổi. Vui lòng thử lại!' + err.message);
//       console.error(err);
//     }
//   };

//   if (loading) return <CircularProgress />;
//   if (!route) {
//     return (
//       <Card>
//         <CardContent>
//           <Typography variant="h5" color="error">Không tìm thấy tuyến đường!</Typography>
//           <Button component={Link} to="/metro-routes" variant="contained" sx={{ mt: 2 }}>
//             Quay lại danh sách
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" gutterBottom>
//           Chi tiết tuyến Metro
//         </Typography>
//         <Typography variant="h6" gutterBottom>
//           {route.name}
//         </Typography>
//         <Stack spacing={1} sx={{ mb: 2 }}>
//           <Typography>Mã tuyến: <b>{route.code}</b></Typography>
//           <Typography>Chiều dài: <b>{route.lengthInKm} km</b></Typography>
//           <Typography component="span">
//             Trạng thái: <Chip label={route.status || 'Chưa rõ'} color={statusColor(route.status)} />
//           </Typography>
//         </Stack>
//         <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
//           <Typography variant="subtitle1" sx={{ mt: 1 }}>
//             Danh sách nhà ga:
//           </Typography>
//           <Button variant="contained" onClick={() => setOpenDialog(true)}>
//             Thêm nhà ga
//           </Button>
//         </Stack>
//         <Paper variant="outlined" sx={{ mb: 2 }}>
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Droppable droppableId="stations">
//               {(provided) => (
//                 // <List sx={{ width: '100%', bgcolor: 'background.paper' }} {...provided.droppableProps} ref={provided.innerRef}>
//                 //   {stations.map((station, index) => (
//                 //     <Draggable key={station.id || station.stationId || station.name} draggableId={String(station.id || station.stationId || station.name)} index={index}>
//                 //       {(provided) => (
//                 //         <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                 //           {index > 0 && (
//                 //             <ListItem sx={{ pl: 6, pr: 6 }}>
//                 //               <TextField
//                 //                 label="Khoảng cách đến ga trước (km)"
//                 //                 type="number"
//                 //                 value={distances[index] || ''}
//                 //                 onChange={e => handleDistanceChange(index, e.target.value)}
//                 //                 sx={{ width: 180 }}
//                 //                 size="small"
//                 //                 inputProps={{ min: 0, step: 0.01 }}
//                 //               />
//                 //             </ListItem>
//                 //           )}
//                 //           <ListItem>
//                 //             <ListItemText
//                 //               primary={`${index + 1}. ${station.name || station.stationName}`}
//                 //             />
//                 //           </ListItem>
//                 //         </div>
//                 //       )}
//                 //     </Draggable>
//                 //   ))}
//                 //   {provided.placeholder}
//                 // </List>

//                 <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
//   {stations.map((station, index) => (
//     <React.Fragment key={station.id || station.stationId || station.name}>
//       <ListItem>
//         <ListItemText
//           primary={`${index + 1}. ${station.name || station.stationName}`}
//         />
//       </ListItem>
//       {index < stations.length - 1 && (
//         <ListItem sx={{ pl: 6, pr: 6 }}>
//           <TextField
//             label="Khoảng cách đến ga tiếp theo (km)"
//             type="number"
//             value={distances[index] || ''}
//             onChange={e => handleDistanceChange(index, e.target.value)}
//             sx={{ width: 180 }}
//             size="small"
//             inputProps={{ min: 0, step: 0.01 }}
//           />
//         </ListItem>
//       )}
//     </React.Fragment>
//   ))}
// </List>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </Paper>
//         <Stack direction="row" spacing={2}>
//           <Button component={Link} to="/metro-routes" variant="outlined">
//             Quay lại danh sách
//           </Button>
//           <Button variant="contained" color="primary" onClick={handleSave}>
//             Lưu thay đổi
//           </Button>
//         </Stack>

//         {/* Dialog thêm nhà ga */}
//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//           <DialogTitle>Thêm nhà ga vào tuyến</DialogTitle>
//           <DialogContent>
//             <TextField
//               select
//               label="Chọn nhà ga"
//               value={selectedStationId}
//               onChange={e => setSelectedStationId(e.target.value)}
//               fullWidth
//               margin="normal"
//               required
//             >
//               <MenuItem value="">-- Chọn nhà ga --</MenuItem>
//               {stationList
//                 .filter(st => !stations.some(s => (s.id || s.stationId) === st.id))
//                 .map(station => (
//                   <MenuItem key={station.id} value={station.id}>
//                     {station.name} ({station.code})
//                   </MenuItem>
//                 ))}
//             </TextField>
//             {/* Không nhập khoảng cách ở đây */}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
//             <Button onClick={handleAddStation} variant="contained">Thêm</Button>
//           </DialogActions>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// };

// export default DetailRoute;









import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card, CardContent, Typography, Button, Stack, Chip, Paper, List, ListItem, ListItemText,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const statusColor = (status) => {
  switch (status) {
    case 'Đang hoạt động':
      return 'success';
    case 'Đang xây dựng':
      return 'warning';
    case 'Đang quy hoạch':
      return 'default';
    default:
      return 'default';
  }
};

const DetailRoute = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [stations, setStations] = useState([]);
  const [distances, setDistances] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');

  // Lấy thông tin route và danh sách station của route
  useEffect(() => {
    fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        // Sắp xếp lại theo order nếu có
        const sortedStations = (data.data.stations || []).sort((a, b) => (a.order || 0) - (b.order || 0));
        setRoute(data.data);
        setStations(sortedStations);
        setDistances(sortedStations.map(st => st.distanceToNext || 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Lấy danh sách tất cả các station (dùng cho select)
  useEffect(() => {
    fetch('https://api.metroticketingsystem.site/api/catalog/Stations', {
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setStationList(data.data.stations || []);
      });
  }, []);

  // Thêm station đã chọn vào cuối danh sách
  const handleAddStation = () => {
    if (!selectedStationId) return;
    const addedStation = stationList.find(st => st.id === selectedStationId);
    setStations(prev => [...prev, addedStation]);
    setDistances(prev => [...prev, 0]);
    setSelectedStationId('');
    setOpenDialog(false);
  };

  // Xử lý kéo thả
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newStations = Array.from(stations);
    const [removed] = newStations.splice(result.source.index, 1);
    newStations.splice(result.destination.index, 0, removed);

    const newDistances = Array.from(distances);
    const [removedDist] = newDistances.splice(result.source.index, 1);
    newDistances.splice(result.destination.index, 0, removedDist);

    setStations(newStations);
    setDistances(newDistances);
  };

  // Cập nhật khoảng cách
  const handleDistanceChange = (idx, value) => {
    const newDistances = [...distances];
    newDistances[idx] = value;
    setDistances(newDistances);
  };

  // Lưu thay đổi lên backend
  const handleSave = async () => {
    try {
      // Đảm bảo đúng logic: distanceToNext của ga cuối luôn là 0, các ga khác lấy từ distances[index]
      const stationRoutes = stations.map((st, idx) => ({
        stationId: st.id || st.stationId,
        routeId: id,
        order: idx + 1,
        distanceToNext: idx === stations.length - 1 ? 0 : parseFloat(distances[idx]) || 0
      }));

      const resRoute = await fetch('https://api.metroticketingsystem.site/api/catalog/Routes/station-route', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          route: {
            routeId: id,
            stationRoutes: stationRoutes
          }
        })
      });
      if (!resRoute.ok) throw new Error('Lỗi khi cập nhật tuyến!' + await resRoute.text());

      // Reload lại danh sách station trong tuyến, sort theo order nếu có
      fetch(`https://api.metroticketingsystem.site/api/catalog/routes/${id}`, {
        headers: { 'Accept': 'application/json' }
      })
        .then(res => res.json())
        .then(data => {
          const sortedStations = (data.data.stations || []).sort((a, b) => (a.order || 0) - (b.order || 0));
          setRoute(data.data);
          setStations(sortedStations);
          setDistances(sortedStations.map(st => st.distanceToNext || 0));
        });

      alert('Đã lưu thay đổi!');
    } catch (err) {
      alert('Không thể lưu thay đổi. Vui lòng thử lại!\n' + err.message);
      console.error(err);
    }
  };

  if (loading) return <CircularProgress />;
  if (!route) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" color="error">Không tìm thấy tuyến đường!</Typography>
          <Button component={Link} to="/metro-routes" variant="contained" sx={{ mt: 2 }}>
            Quay lại danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Chi tiết tuyến Metro
        </Typography>
        <Typography variant="h6" gutterBottom>
          {route.name}
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography>Mã tuyến: <b>{route.code}</b></Typography>
          <Typography>Chiều dài: <b>{route.lengthInKm} km</b></Typography>
          <Typography component="span">
            Trạng thái: <Chip label={route.status || 'Chưa rõ'} color={statusColor(route.status)} />
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Danh sách nhà ga:
          </Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Thêm nhà ga
          </Button>
        </Stack>
        <Paper variant="outlined" sx={{ mb: 2 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stations">
              {(provided) => (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }} ref={provided.innerRef} {...provided.droppableProps}>
                  {stations.map((station, index) => (
                    <Draggable
                      key={station.id || station.stationId || station.name}
                      draggableId={String(station.id || station.stationId || station.name)}
                      index={index}
                    >
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <ListItem>
                            <ListItemText
                              primary={`${index + 1}. ${station.name || station.stationName}`}
                            />
                          </ListItem>
                          {index < stations.length - 1 && (
                            <ListItem sx={{ pl: 6, pr: 6 }}>
                              <TextField
                                label="Khoảng cách đến ga tiếp theo (km)"
                                type="number"
                                value={distances[index] || ''}
                                onChange={e => handleDistanceChange(index, e.target.value)}
                                sx={{ width: 180 }}
                                size="small"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </ListItem>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/metro-routes" variant="outlined">
            Quay lại danh sách
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </Stack>

        {/* Dialog thêm nhà ga */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Thêm nhà ga vào tuyến</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Chọn nhà ga"
              value={selectedStationId}
              onChange={e => setSelectedStationId(e.target.value)}
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="">-- Chọn nhà ga --</MenuItem>
              {stationList
                .filter(st => !stations.some(s => (s.id || s.stationId) === st.id))
                .map(station => (
                  <MenuItem key={station.id} value={station.id}>
                    {station.name} ({station.code})
                  </MenuItem>
                ))}
            </TextField>
            {/* Không nhập khoảng cách ở đây */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button onClick={handleAddStation} variant="contained">Thêm</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DetailRoute;
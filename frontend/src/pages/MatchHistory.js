import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function MatchHistoryScreen() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
    window.location.reload();
  }

  return (
    <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
        <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <p style={{fontSize: '2em', fontWeight: 'bold'}}>Match history</p>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <div style={{height: '1.5vh'}}></div>
            <Button 
                variant="contained" 
                color="secondary"
                onClick={() => {
                  goBack();
                }}
            >Go back</Button>
        </div>
    </div>
  );
}
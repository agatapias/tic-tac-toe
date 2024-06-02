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
import { REACT_APP_IP_BACK, REACT_APP_IP_FRONT } from '../constants'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

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

let getHistory = async () => {
  const username = localStorage.getItem('username');
  const accessToken = localStorage.getItem('accessToken');

  let response = await fetch(`http://${REACT_APP_IP_BACK}:8081/match-history/${username}`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors',
      referrerPolicy: 'no-referrer',
      origin: `http://${REACT_APP_IP_FRONT}:3000/`,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
}

  return response.json();
}

const handleGetHistory = async (setHistory) => {
  try {
    const result = await getHistory();
    setHistory(result);
    console.log(`Get history successful: ${JSON.stringify(result)}`);
  } catch (error) {
      console.log(`Get history failed: ${error.message}`);
  }
};

function Square({ value }) {
  let label
  console.log("value: " + value)
  if (value == null) label = " "
  else if (value == true) label = "X"
  else label = "O"

  return (
      <Button variant="contained">{label}</Button>
  );
}

function Board({selectedMatch}) {
  return (
      <>
          <div className="board-row">
              <Square value={selectedMatch.match.board[0].sign} />
              <Square value={selectedMatch.match.board[1].sign} />
              <Square value={selectedMatch.match.board[2].sign} />
          </div>
          <div className="board-row">
              <Square value={selectedMatch.match.board[3].sign} />
              <Square value={selectedMatch.match.board[4].sign} />
              <Square value={selectedMatch.match.board[5].sign} />
          </div>
          <div className="board-row">
              <Square value={selectedMatch.match.board[6].sign} />
              <Square value={selectedMatch.match.board[7].sign} />
              <Square value={selectedMatch.match.board[8].sign} />
          </div>
      </>
  );
}

export default function MatchHistoryScreen() {
  const [history, setHistory] = React.useState([]);
  const [selectedMatch, setSelectedMatch] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetHistory(setHistory)
  }, []);

  const goBack = () => {
    navigate(-1);
  }

  let title = selectedMatch !== "" ? `Match ${selectedMatch.playerWon.displayName} - ${selectedMatch.playerLost.displayName}` : "Match"

  if (history.length === 0) {
    return (
      <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
        <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <p style={{fontSize: '2em', fontWeight: 'bold'}}>Match history</p>
            <div style={{height: '1.5vh'}}></div>
            <p style={{fontSize: '1em', fontWeight: 'regular'}}>You have no matches yet</p>
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
  } else {
    return (
      <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
          <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <p style={{fontSize: '2em', fontWeight: 'bold'}}>Match history</p>
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                  <TableRow>
                      <TableCell align="center">Player won</TableCell>
                      <TableCell align="center">Player lost</TableCell>
                      <TableCell align="center">Timestamp</TableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                  {history.map((row) => (
                      <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      onClick={() => setSelectedMatch(row)}
                      >
                      <TableCell align="center">{row.playerWon.displayName}</TableCell>
                      <TableCell align="center">{row.playerLost.displayName}</TableCell>
                      <TableCell align="center">{new Date(row.timestamp * 1000).toDateString()}</TableCell>
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
              <Dialog onClose={() => setSelectedMatch("")} open={selectedMatch !== ""}>
                <DialogTitle>{title}</DialogTitle>
                <Board selectedMatch={selectedMatch}/>
              </Dialog>
          </div>
      </div>
    );
  }
}
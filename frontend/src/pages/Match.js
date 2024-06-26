import * as React from 'react';
import { useState } from 'react';
import * as StompJs from '@stomp/stompjs';
import Button from '@mui/material/Button';
import SockJS from "sockjs-client"
import ErrorAlert from '../components/Alert';
import WinAlert from '../components/WinAlert';
import { REACT_APP_IP_BACK, REACT_APP_IP_FRONT } from '../constants'
import { useLocation, useNavigate } from 'react-router-dom';

export default function MatchScreen({}) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { matchData } = state;

    const [match, setMatch] = useState(matchData);
    const [alert, setAlert] = useState("");
    const [won, setWon] = useState(false);
    const [lost, setLost] = useState(false);

    const socket = new SockJS(`http://${REACT_APP_IP_BACK}:8081/stomp/`)
    const ws = StompJs.Stomp.over(socket)

    React.useEffect(() => {
        const playerName = localStorage.getItem('username');
        const token = localStorage.getItem('accessToken');
        ws.connect({ Authorization: `Bearer ${token}` }, () => {
            ws.subscribe("/topic/matchWon/" + playerName, payload => {
                console.log("Match ended!")
                console.log("payload: ")
                let data = JSON.parse(payload.body)
                console.log(data)
                if (data == false) {
                    setLost(true);
                } else {
                    setWon(true);
                }
            });

            ws.subscribe("/topic/matchChange/" + playerName, payload => {
                console.log("Succesfully updated match!")
                let data = JSON.parse(payload.body)
                console.log("payload: ")
                console.log(data)
                setMatch(data)
            });
        });
    }, []);

    let sendMove = async (position) => {
        const playerName = localStorage.getItem('username');
        const accessToken = localStorage.getItem('accessToken');

        try {
            if (match.board[position - 1].sign != null) {
                setAlert("Select an empty field.");
                return
            }
            if (match.isPlayer1Turn && playerName != match.player1.name) {
                setAlert("It is not your turn.");
                return
            } else if (!match.isPlayer1Turn && playerName == match.player1.name) {
                setAlert("It is not your turn.");
                return
            }

            let res = await fetch(`http://${REACT_APP_IP_BACK}:8081/match/` + match.id + "/" + position, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                referrerPolicy: 'no-referrer',
                origin: `http://${REACT_APP_IP_FRONT}:3000/`,
            });

            if (res.status === 200) {
                console.log("send move succeded");
                let player = await res.json();
                console.log(player);
            } else if (res.status === 409) {
                console.log("This field is already selected.");
                setAlert("This field is already selected.");
            } else {
                console.log("Could not send move.");
                setAlert("Could not send move.");
            }
        } catch (error) {
            console.log(error);
            setAlert("Could not send move.");
        }
    }

    function Square({ value, onSquareClick }) {
        let label
        console.log("value: " + value)
        if (value == null) label = " "
        else if (value == true) label = "X"
        else label = "O"

        return (
            <Button variant="contained" onClick={onSquareClick}>
                {label}
            </Button>
        );
    }

    function Board() {
        return (
            <>
                <div className="board-row">
                    <Square value={match.board[0].sign} onSquareClick={() => sendMove(1)} />
                    <Square value={match.board[1].sign} onSquareClick={() => sendMove(2)} />
                    <Square value={match.board[2].sign} onSquareClick={() => sendMove(3)} />
                </div>
                <div className="board-row">
                    <Square value={match.board[3].sign} onSquareClick={() => sendMove(4)} />
                    <Square value={match.board[4].sign} onSquareClick={() => sendMove(5)} />
                    <Square value={match.board[5].sign} onSquareClick={() => sendMove(6)} />
                </div>
                <div className="board-row">
                    <Square value={match.board[6].sign} onSquareClick={() => sendMove(7)} />
                    <Square value={match.board[7].sign} onSquareClick={() => sendMove(8)} />
                    <Square value={match.board[8].sign} onSquareClick={() => sendMove(9)} />
                </div>
            </>
        );
    }

    let player = match.isPlayer1Turn ? match.player1.displayName : match.player2.displayName

    function EndAlert() {
        if (won) {
            return (
                <WinAlert alert={"You won!"} setAlert={setWon} />
            );
        } else if (lost) {
            return (
                <ErrorAlert alert={"You lost!"} setAlert={setLost} />
            );
        } else {
            return (null);
        }
    }

    const goBack = () => {
        navigate(-1);
      }
    

    return (
        <div className="register" style={{ display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)' }}>
            <ErrorAlert alert={alert} setAlert={setAlert} />
            <EndAlert />
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textDecorationColor: 'white' }}>
                <p style={{ color: 'white' }}>
                    Turn: {player}
                </p>
                <div style={{ height: '2vh' }}></div>
                <Board />
                <div style={{height: '3vh'}}></div>
                <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={() => {
                        goBack();
                    }}
                >Leave</Button>
            </div>
        </div>
    );
}
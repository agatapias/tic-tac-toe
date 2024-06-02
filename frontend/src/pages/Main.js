import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorAlert from '../components/Alert';
import { useNavigate } from "react-router-dom";
import { REACT_APP_IP_BACK, REACT_APP_IP_FRONT } from '../constants'
import * as StompJs from '@stomp/stompjs';
import SockJS from "sockjs-client"
import { CircularProgress } from '@mui/material';

let sendPlayerName = async(setIsWaiting, setAlert) => {
    try {
        const username = localStorage.getItem('username');
        const name = localStorage.getItem('name');
        const accessToken = localStorage.getItem('accessToken');
        console.log(`starting match for: ${username}`)
        if (username === "") {
            setAlert("Player name cannot be empty.");
            return
        }
        setIsWaiting(true);
        
        let res = await fetch(`http://${REACT_APP_IP_BACK}:8081/player/${username}/${name}`, {
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
            console.log("register player succeded");
            let player = await res.json();
            console.log(player);
        } else if (res.status === 400) {
            console.log("Player name cannot be empty.");
            setAlert("Player name cannot be empty.");
        } else if (res.status === 409) {
            console.log("Player with this name already exists.");
            setAlert("Player with this name already exists.");
        } else {
            console.log("Register player failed.");
            setAlert("Register player failed.");
        }
    } catch (error) {
        console.log(error);
        setAlert("Register player failed.");
    }
}

export default function MainScreen({onLogout, setMatch}) {
    const [alert, setAlert] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);
    const navigate = useNavigate();

    const socket = new SockJS(`http://${REACT_APP_IP_BACK}:8081/stomp/`)
    const ws = StompJs.Stomp.over(socket)

    React.useEffect(() => {
        if (isWaiting) {
            const token = localStorage.getItem('accessToken');
            const playerName = localStorage.getItem('username');

            ws.connect({ Authorization: `Bearer ${token}` }, () => {
                ws.subscribe("/topic/matchStarted/"+playerName, payload => {
                    console.log("Succesfully created match! navigating to match...")
                    console.log("payload: ")
                    let data = JSON.parse(payload.body)
                    console.log(data)
                    setMatch(data)
                    openMatch(data)
                });
            });
        }
    }, [isWaiting]);

    const openMatchHistory = () => {
        navigate('/match-history')
        window.location.reload();
    }

    const openMatch = (matchData) => {
        navigate('/match', {
            state: {
              matchData: matchData
            }
        });
        window.location.reload();
    }
  
    if (isWaiting) {
        return (
            <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
              <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <p style={{color:'white'}}>
                    Waiting for another player...
                </p>
                <div style={{height: '2vh'}}></div>
                <CircularProgress />
              </div>
            </div>
        );
    } else {
        return (
        <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
            <ErrorAlert alert={alert} setAlert={setAlert}/>
            <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <p style={{fontSize: '2em', fontWeight: 'bold'}}>Tic-tac-toe game</p>
                <div style={{height: '2vh'}}></div>
                <Button 
                    variant="contained" 
                    onClick={() => {
                        sendPlayerName(setIsWaiting, setAlert);
                    }}
                >Play game</Button>
                <div style={{height: '1.5vh'}}></div>
                <Button 
                    variant="contained" 
                    onClick={() => {
                        openMatchHistory();
                    }}
                >View match history</Button>
                <div style={{height: '1.5vh'}}></div>
                <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={() => {
                        onLogout();
                    }}
                >Log out</Button>
            </div>
        </div>
        );
    }
  }
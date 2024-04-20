import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorAlert from '../components/Alert';

export default function RegisterPlayerScreen({playerName, setPlayerName, setNameSent}) {
    const [alert, setAlert] = useState("");

    let sendPlayerName = async() => {
        try {
            if (playerName === "") {
                setAlert("Player name cannot be empty.");
                return
            }
            setNameSent(true);
            
            let res = await fetch(`http://${process.env.REACT_APP_IP}:8081/player/` + playerName, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                referrerPolicy: 'no-referrer',
                origin: `http://${process.env.REACT_APP_IP}:3000/`,
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
  
    return (
      <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
        <ErrorAlert alert={alert} setAlert={setAlert}/>
        <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <div>
                <TextField 
                    id="outlined-basic" 
                    label="Player name" 
                    variant="filled" 
                    value={playerName}
                    onChange={(event) => {
                        setPlayerName(event.target.value);
                    }}
                />
            </div>
            <div style={{height: '2vh'}}></div>
            <Button 
                variant="contained" 
                onClick={() => {
                    sendPlayerName();
                }}
            >Send</Button>
        </div>
      </div>
    );
  }
import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorAlert from '../components/Alert';
import { useNavigate } from "react-router-dom";
import { REACT_APP_IP_BACK, REACT_APP_IP_FRONT, awsRegion, clientId } from '../constants'

const login = async (email, password) => {
    const url = `https://cognito-idp.${awsRegion}.amazonaws.com/`;
  
    const requestBody = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };
    
    console.log(`signUp request body: ${JSON.stringify(requestBody)}`);
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
      },
      body: JSON.stringify(requestBody)
    });
  
    return response.json();
  };

  const handleLogin = async (email, password) => {
    try {
        const result = await login(email, password);
        const accessToken = result.AuthenticationResult.AccessToken;

        // Store the access token
        localStorage.setItem('accessToken', accessToken);

        console.log(`Login successful: ${JSON.stringify(result)}`);
        console.log(`Token: ${accessToken}`);
        setSuccessAlert(`Login successful`);
    } catch (error) {
        console.log(`Login failed: ${error.message}`);
        setAlert(`Login failed`);
    }
  };

export default function LoginScreen({playerName, setPlayerName, setNameSent}) {
    const [alert, setAlert] = useState("");
    const [successAlert, setSuccessAlert] = useState("");
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    let login = async() => {
        try {
            if (playerName === "") {
                setAlert("Player name cannot be empty.");
                return
            }
            setNameSent(true);
            
            let res = await fetch(`http://${REACT_APP_IP_BACK}:8081/player/` + playerName, {
                method: 'POST',
                headers: {
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

    const navigate = useNavigate();

    const openRegister = () => {
        navigate('/sign_up')
        window.location.reload();
    }
  
    return (
      <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
        <ErrorAlert alert={alert} setAlert={setAlert}/>
        <WinAlert alert={successAlert} setAlert={setSuccessAlert} />
        <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <p style={{fontSize: '2em', fontWeight: 'bold'}}>Login</p>
            <div>
                <TextField 
                    id="outlined-basic" 
                    label="Username" 
                    variant="filled" 
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
            </div>
            <div style={{height: '1vh'}}></div>
            <div>
                <TextField 
                    id="outlined-basic" 
                    label="Password" 
                    type="password"
                    variant="filled" 
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
            </div>
            <div style={{height: '2vh'}}></div>
            <Button 
                variant="contained" 
                onClick={() => {
                    handleLogin(email, password);
                }}
            >Login</Button>
            <div style={{height: '1.5vh'}}></div>
            <p style={{fontSize: '1em'}}>No account?</p>
            <div style={{height: '1.5vh'}}></div>
            <Button 
                variant="contained" 
                color="secondary"
                onClick={() => {
                    openRegister();
                }}
            >Register</Button>
        </div>
      </div>
    );
  }
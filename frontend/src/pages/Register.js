import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorAlert from '../components/Alert';
import WinAlert from '../components/WinAlert';
import { REACT_APP_IP_BACK, REACT_APP_IP_FRONT, awsRegion, clientId } from '../constants'
import { useNavigate } from "react-router-dom";

const signUp = async (email, name, password) => {
    const url = `https://cognito-idp.${awsRegion}.amazonaws.com/`;
  
    const requestBody = {
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name }
      ]
    };
    
    console.log(`signUp request body: ${JSON.stringify(requestBody)}`);
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp'
      },
      body: JSON.stringify(requestBody)
    });
  
    return response.json();
  };

  const confirmSignUp = async (email, code) => {
    const url = `https://cognito-idp.${awsRegion}.amazonaws.com/`;
  
    const requestBody = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code
    };
    
    console.log(`confirmSignUp request body: ${JSON.stringify(requestBody)}`);
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp'
      },
      body: JSON.stringify(requestBody)
    });
  
    return response.json();
  };


  const handleSignUp = async (email, name, password, setAlert, setSuccessAlert) => {
    try {
      const result = await signUp(email, name, password);
      console.log(`Sign up successful: ${JSON.stringify(result)}`);
      setSuccessAlert("Sign up successful");
    } catch (error) {
        console.log(`Sign up failed: ${error.message}`);
        setAlert(`Sign up failed}`);
    }
  };

  const handleConfirmSignUp = async (email, code, setAlert, setSuccessAlert) => {
    try {
      const result = await confirmSignUp(email, code);
      console.log(`Confirmation successful: ${JSON.stringify(result)}`);
      setSuccessAlert(`Confirmation successful`);
    } catch (error) {
        console.log(`Confirmation failed: ${error.message}`);
        setAlert(`Confirmation failed`);
    }
  };

export default function RegisterScreen({playerName, setPlayerName, setNameSent}) {
    const [alert, setAlert] = useState("");
    const [successAlert, setSuccessAlert] = useState("");
    
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    let register = async() => {
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

    let openLogin = async() => {
        navigate('/login')
        window.location.reload();
    }
  
    return (
      <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
        <ErrorAlert alert={alert} setAlert={setAlert}/>
        <WinAlert alert={successAlert} setAlert={setSuccessAlert} />
        <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <p style={{fontSize: '2em', fontWeight: 'bold'}}>Register</p>
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
                    label="Name"
                    variant="filled" 
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
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
                    handleSignUp(email, name, password, setAlert, setSuccessAlert);
                }}
            >Register</Button>
            <div style={{height: '1.5vh'}}></div>
            <p style={{fontSize: '1em'}}>Already have an account?</p>
            <div style={{height: '1.5vh'}}></div>
            <Button 
                variant="contained" 
                color="secondary"
                onClick={() => {
                    openLogin();
                }}
            >Login</Button>
            <div style={{height: '3vh'}}></div>
            <p style={{fontSize: '1em', fontWeight: 'semi-bold'}}>Enter the code from your email to confirm registration</p>
            <div>
                <TextField 
                    id="outlined-basic" 
                    label="Confirm registration"
                    variant="filled" 
                    value={code}
                    onChange={(event) => {
                        setCode(event.target.value);
                    }}
                />
            </div>
            <div style={{height: '2vh'}}></div>
            <Button 
                variant="contained" 
                onClick={() => {
                    handleConfirmSignUp(email, code, setAlert, setSuccessAlert);
                }}
            >Send</Button>
        </div>
      </div>
    );
  }
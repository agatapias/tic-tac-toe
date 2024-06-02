import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorAlert from '../components/Alert';
import WinAlert from '../components/WinAlert';
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

  const handleLogin = async (email, password, onUserChange, setAlert, setSuccessAlert, onSuccess) => {
    try {
        const result = await login(email, password);
        const accessToken = result.AuthenticationResult.AccessToken;

        // Store the access token and email
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('username', email);
        onUserChange(email);

        console.log(`Login successful: ${JSON.stringify(result)}`);
        console.log(`Token: ${accessToken}`);
        setSuccessAlert(`Login successful`);
        onSuccess()
    } catch (error) {
        console.log(`Login failed: ${error.message}`);
        setAlert(`Login failed`);
    }
  };

export default function LoginScreen({onUserChange}) {
    const [alert, setAlert] = useState("");
    const [successAlert, setSuccessAlert] = useState("");
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const openRegister = () => {
        navigate('/register')
        window.location.reload();
    }
  
    const openMain = () => {
        navigate('/')
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
                    handleLogin(email, password, onUserChange, setAlert, setSuccessAlert, openMain);
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
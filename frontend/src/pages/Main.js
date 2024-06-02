import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ErrorAlert from '../components/Alert';
import { useNavigate } from "react-router-dom";
import { REACT_APP_IP_BACK, REACT_APP_IP_FRONT } from '../constants'

export default function MainScreen({playerName}) {
    const [alert, setAlert] = useState("");

    let login = async() => {
        
    }

    const navigate = useNavigate();

    const openRegister = () => {
        navigate('/sign_up')
        window.location.reload();
    }
  
    return (
      <div className="register" style={{display: 'flex', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundImage: 'linear-gradient(to bottom right, purple, cornflowerBlue)'}}>
        <ErrorAlert alert={alert} setAlert={setAlert}/>
        <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <p style={{fontSize: '2em', fontWeight: 'bold'}}>Login</p>
            <div style={{height: '2vh'}}></div>
            <Button 
                variant="contained" 
                onClick={() => {
                    login();
                }}
            >Play game</Button>
            <div style={{height: '1.5vh'}}></div>
            <Button 
                variant="contained" 
                onClick={() => {
                    login();
                }}
            >View match history</Button>
            <div style={{height: '1.5vh'}}></div>
            <Button 
                variant="contained" 
                color="secondary"
                onClick={() => {
                    openRegister();
                }}
            >Log out</Button>
        </div>
      </div>
    );
  }
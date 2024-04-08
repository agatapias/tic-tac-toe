import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function WaitingScreen() {
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
}
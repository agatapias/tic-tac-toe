import * as React from 'react';
import { useState } from 'react';
import MatchScreen from './pages/Match';
import RegisterPlayerScreen from './pages/RegisterPlayer';
import * as StompJs from '@stomp/stompjs';
import SockJS from "sockjs-client"
import WaitingScreen from './pages/Waiting';
import { REACT_APP_IP_BACK } from './constants'
import LoginScreen from './pages/Login';
import RegisterScreen from './pages/Register';
import MatchHistoryScreen from './pages/MatchHistory';
import MainScreen from './pages/Main';
import useLocalStorage, {userKey} from './hooks/LocalStorageHook';
import { BrowserRouter as Router, Routes, Route, redirect, Navigate } from 'react-router-dom';

function getLoggedOutScreen(user, screen){
  if (user !== "")
    return <Navigate to="/" replace/>;
  else 
    return screen;
}

function getScreen(user, screen){
  if (user !== "")
    return screen;
  else 
    return <Navigate to="/login" replace/>;
}


export default function Game() {
  const [match, setMatch] = useState(null);

  const [user, setUser, removeUser] = useLocalStorage(userKey, "");
  const onUserChange = (usern) => setUser(usern);
  const onRemoveUser = () => removeUser();

  const onLogout = () => {
    onRemoveUser();
    localStorage.setItem('accessToken', "");
    localStorage.setItem('username', "");
    window.location.reload();
  }

  return (
    <div className="game">
        <Router>
        <Routes>
          <Route>
          {/* <Route element={<ProtectedRoutes user={user} isHidden={hiddenNavbarRoutes.includes(window.location.pathname)} onLogout={() => onLogout()}/>}> */}
            {/*Logged out screens*/}
            <Route exact path="/login" element={getLoggedOutScreen(user, <LoginScreen  onUserChange={onUserChange} />)} />
            <Route exact path="/register" element={getLoggedOutScreen(user, <RegisterScreen />)} />

            {/*Logged in screens*/}
            <Route exact path="/" element={getScreen(user, <MainScreen  onLogout={onLogout} setMatch={setMatch}/>)} />
            <Route exact path="/match-history" element={getScreen(user, <MatchHistoryScreen />)} />
            {/* <Route exact path="/waiting" element={getScreen(user, <WaitingScreen user={user} />)} /> */}
            <Route exact path="/match" element={getScreen(user, <MatchScreen/>)} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

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
import useLocalStorage, {userKey} from './hooks/LocalStorageHook';

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
  
  const [playerName, setPlayerName] = useState("");
  const [nameSent, setNameSent] = useState(false);

  const [user, setUser, removeUser] = useLocalStorage(userKey, "");
  const onUserChange = (usern) => setUser(usern);
  const onRemoveUser = () => removeUser();

  const onLogout = () => {
    onRemoveUser();
    window.location.reload();
  }

  const socket = new SockJS(`http://${REACT_APP_IP_BACK}:8081/stomp/`)
  const ws = StompJs.Stomp.over(socket)

  React.useEffect(() => {
      if (nameSent) {
      ws.connect({}, () => {
          ws.subscribe("/topic/matchStarted/"+playerName, payload => {
              console.log("Succesfully created match! navigating to match...")
              console.log("payload: ")
              let data = JSON.parse(payload.body)
              console.log(data)
              setMatch(data)
          });
      });
  }
  }, [nameSent]);

  if (match == null) {
    if (nameSent) {
      return (
        <div className="game">
           <Router>
            <Routes>
              <Route element={<ProtectedRoutes user={user} isHidden={hiddenNavbarRoutes.includes(window.location.pathname)} onLogout={() => onLogout()}/>}>
                {/*Logged out screens*/}
                <Route exact path="/login" element={getLoggedOutScreen(user, <LoginScreen  onUserChange={onUserChange} />)} />
                <Route exact path="/register" element={getLoggedOutScreen(user, <RegisterScreen />)} />

                {/*Logged in screens*/}
                <Route exact path="/" element={getScreen(user, <MainScreen  user={user} />)} />
                <Route exact path="/match-history" element={getScreen(user, <MatchHistoryScreen user={user} />)} />
                <Route exact path="/waiting" element={getScreen(user, <WaitingScreen user={user} />)} />
                <Route exact path="/match" element={getScreen(user, <MatchScreen user={user} />)} />
              </Route>
            </Routes>
          </Router>
          <WaitingScreen />
        </div>
      );
    } else {
      return (
        <div className="game">
          <LoginScreen playerName={playerName} setPlayerName={setPlayerName} setNameSent={setNameSent}/>
        </div>
      );
    }
  } else {
    return (
      <div className="game">
        <MatchScreen matchData={match} playerName={playerName}/>
      </div>
    );
  }
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

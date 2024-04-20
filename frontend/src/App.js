import * as React from 'react';
import { useState } from 'react';
import MatchScreen from './pages/Match';
import RegisterPlayerScreen from './pages/RegisterPlayer';
import * as StompJs from '@stomp/stompjs';
import SockJS from "sockjs-client"
import WaitingScreen from './pages/Waiting';

let IP = "44.202.76.10"  // "localhost" when running locally

export default function Game() {
  const [match, setMatch] = useState(null);
  
  const [playerName, setPlayerName] = useState("");
  const [nameSent, setNameSent] = useState(false);

  const socket = new SockJS(`http://${REACT_APP_IP}:8081/stomp/`)
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
          <WaitingScreen />
        </div>
      );
    } else {
      return (
        <div className="game">
          <RegisterPlayerScreen playerName={playerName} setPlayerName={setPlayerName} setNameSent={setNameSent}/>
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

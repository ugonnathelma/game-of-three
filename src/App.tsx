import React, { useEffect, useState } from "react";
import { Body, Container } from "./styles";

import Game from "./components/Game";
import Loader from "./components/atoms/Loader";
import { Move } from "./common/types";

function App() {
  const [playerId, setPlayerId] = useState(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);

  const lastMove = moves[moves.length - 1];

  useEffect(() => {
    const createPlayer = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.status === 201) {
        setPlayerId(result.id);
        setMoves(result.moves);
      } else {
        setError(result.error.message);
      }

      setLoading(false);
    };

    createPlayer();
  }, []);

  return (
    <Body className="App">
      <h2>Game of Three</h2>
      <hr />
      <br></br>
      {loading ? (
        <Container>
          <Loader />
        </Container>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Game
          moves={moves}
          setTimeLeft={setTimeLeft}
          playerId={playerId || ""}
          setMoves={setMoves}
          lastMove={lastMove}
          timeLeft={timeLeft}
        />
      )}
    </Body>
  );
}

export default App;

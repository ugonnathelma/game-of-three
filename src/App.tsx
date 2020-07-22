import React, { useEffect, useState, ChangeEvent } from "react";
import { Body, Container } from "./styles";

import Game from "./components/Game";
import Loader from "./components/atoms/Loader";
import { Move } from "./common/types";
import Button from "./components/atoms/Button";
import RadioButton from "./components/atoms/RadioButton";

function App() {
  const [playerId, setPlayerId] = useState(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameType, setGameType] = useState("comp-human");

  const lastMove = moves[moves.length - 1];

  useEffect(() => {
    const joinGame = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response, "nk");

      if (response.status !== 200) {
        const result = await response.json();
        setError(result.error.message);
      }

      setLoading(false);
    };

    joinGame();
  }, []);

  const startGame = async () => {
    setLoading(true);
    const response = await fetch(
      `http://localhost:3001/start?gameType=${gameType}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response, "lkk");

    const result = await response.json();

    if (response.status === 201) {
      setPlayerId(result.id);
      setMoves(result.moves);
    } else {
      setError(result.error.message);
    }

    setLoading(false);
  };

  const handleCheckRadio = (event: ChangeEvent<HTMLInputElement>) => {
    setGameType(event.target.value);
  };

  const componentStates = {
    loading: (
      <Container>
        <Loader />
      </Container>
    ),
    error: <div>{error}</div>,
    success: (
      <>
        <RadioButton
          checked={gameType}
          onCheck={handleCheckRadio}
          options={[
            { label: "You vs. Computer", value: "comp-human" },
            { label: "Computer vs. Computer", value: "comp-comp" },
            { label: "You vs. Human", value: "human-human" },
          ]}
          name="gameType"
        />
        <Button height="50px" width="auto" onClick={startGame}>
          Start game
        </Button>
      </>
    ),
    game: (
      <Game
        moves={moves}
        setTimeLeft={setTimeLeft}
        playerId={playerId || ""}
        setMoves={setMoves}
        lastMove={lastMove}
        timeLeft={timeLeft}
      />
    ),
  };

  return (
    <Body className="App">
      <h2>Game of Three</h2>
      <hr />
      <br></br>
      {loading
        ? componentStates.loading
        : error
        ? componentStates.error
        : moves.length
        ? componentStates.game
        : componentStates.success}
    </Body>
  );
}

export default App;

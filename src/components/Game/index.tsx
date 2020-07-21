import React, { useEffect, useState } from "react";
import Button from "../atoms/Button";
import { Play, Moves, WinnerOverlay } from "./styles";
import { Move } from "../../common/types";
import { makeMove, getMoves } from "../../lib";

type GameProps = {
  moves: Move[];
  playerId: string;
  setMoves: (moves: Move[]) => void;
  setTimeLeft: (time: number) => void;
  timeLeft: number;
  lastMove: Move;
};

const Game = ({
  moves,
  playerId,
  setMoves,
  setTimeLeft,
  timeLeft,
  lastMove,
}: GameProps) => {
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!winner) {
        const {
          winnerId,
          moves: movesFromApi,
          maxPlayersReached,
          timeLeft,
        } = await getMoves();

        if (winnerId) {
          setWinner(winnerId);
        }

        if (movesFromApi) {
          const playLengthIncreased = movesFromApi.length !== moves.length;
          if (playLengthIncreased) setMoves(movesFromApi);
          // start countdown only when two players have joined
          maxPlayersReached && setTimeLeft(timeLeft);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [moves.length, setMoves, setTimeLeft, winner]);

  const notYourTurn = lastMove?.id === playerId;

  return (
    <>
      {winner && (
        <WinnerOverlay>
          <b>
            Game Over!
            <br />
            {winner === playerId ? "You won" : "Your opponent won"}
          </b>
        </WinnerOverlay>
      )}
      <div>
        <b>Time Left To Play:</b> {timeLeft} secs
      </div>
      <br />
      <br />
      <div>
        {moves.map(({ id, number }: Move, index: number) => {
          const thisPlayer = playerId === id;

          return (
            <Play thisPlayer={thisPlayer} key={index}>
              <p>{thisPlayer ? "You" : "Opponent"}</p>
              <div>{number}</div>
            </Play>
          );
        })}
      </div>
      <Moves>
        {!winner && (
          <>
            <b>Make a Move: </b>
            <Button
              height="50px"
              width="50px"
              onClick={() => makeMove(1, playerId)}
              disabled={notYourTurn}
            >
              1
            </Button>
            <Button
              onClick={() => makeMove(0, playerId)}
              height="50px"
              width="50px"
              disabled={notYourTurn}
            >
              0
            </Button>
            <Button
              onClick={() => makeMove(-1, playerId)}
              height="50px"
              width="50px"
              disabled={notYourTurn}
            >
              -1
            </Button>
          </>
        )}
      </Moves>
    </>
  );
};

export default Game;

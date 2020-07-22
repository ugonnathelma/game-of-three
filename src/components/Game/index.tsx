import React, { useEffect, useState } from "react";
import Button from "../atoms/Button";
import { Play, Moves } from "./styles";
import { Move } from "../../common/types";
import { makeMove, getMoves } from "../../lib";
import GameOver from "./GameOver";

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
        } = await getMoves(playerId);

        winnerId && setWinner(winnerId);

        if (movesFromApi) {
          const playLengthIncreased = movesFromApi.length !== moves.length;
          if (playLengthIncreased) setMoves(movesFromApi);
          // start countdown only when two players have joined
          maxPlayersReached && setTimeLeft(timeLeft);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [moves.length, playerId, setMoves, setTimeLeft, winner]);

  const handleMove = (number: number) => {
    makeMove(number, playerId);
  };

  const notYourTurn = lastMove?.id === playerId;

  const moveNumbers = [-1, 0, 1];

  return (
    <>
      {winner && <GameOver youWon={winner === playerId} />}
      <div>
        <b>Time Left To Play:</b> {timeLeft} secs
      </div>
      <br />
      <br />
      <div>
        {moves.map(({ id, number, formula }: Move, index: number) => {
          const thisPlayer = playerId === id;

          return (
            <Play thisPlayer={thisPlayer} key={index}>
              <div>{formula}</div>
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
            {moveNumbers.map((number) => {
              // restrict any move that makes result lower than 1
              const moveNotAllowed = (lastMove?.number + number) / 3 < 1;

              return (
                <Button
                  key={number}
                  height="50px"
                  width="50px"
                  onClick={() => handleMove(number)}
                  disabled={notYourTurn || moveNotAllowed}
                >
                  {number}
                </Button>
              );
            })}
          </>
        )}
      </Moves>
    </>
  );
};

export default Game;

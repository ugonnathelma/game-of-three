import React from "react";
import { WinnerOverlay } from "./styles";

type GameOverProps = {
  youWon: boolean;
};

const GameOver = ({ youWon }: GameOverProps) => {
  return (
    <WinnerOverlay>
      <b>
        Game Over!
        <br />
        {youWon ? "You won" : "Your opponent won"}
      </b>
    </WinnerOverlay>
  );
};

export default GameOver;

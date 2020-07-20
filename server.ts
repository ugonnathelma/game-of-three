const express = require("express");
const app = express();
const port = 3001;
const maxMinsToPlay = 2;

let players = [];
let moves = [];
let winner = null;
let gameInSession = false;
let maxPlayersReached = false;

const getLastMove = () => moves[moves.length - 1];

const endGame = (playerId) => {
  winner = playerId;
  gameInSession = false;
  maxPlayersReached = false;
  players = [];
};

app.use((_req, res, next) => {
  res.append("Access-Control-Allow-Origin", "http://localhost:3000");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.post("/", (_req, res) => {
  if (maxPlayersReached) {
    res.status(503).json({
      error: { message: "Game is already full! Try again later" },
    });
  } else {
    // generate player id
    const playerId = Math.random().toString(36).substring(2, 15);

    const newPlayer = {
      id: playerId,
    };
    players.push(newPlayer);

    // set game to full once there are two players...
    // implementation for future, have different game session to allow more users play simultaneously
    if (players.length >= 2) {
      maxPlayersReached = true;
    }

    if (!gameInSession) {
      // make first move with random number between 10 and 100
      const numberPlayed = Math.floor(Math.random() * (100 - 10 + 1) + 10);
      moves = [];
      moves.push({
        createdAt: Date.now(),
        id: playerId,
        number: numberPlayed,
      });

      // start game
      gameInSession = true;
    }

    res.status(201).json({
      id: playerId,
      moves,
    });
  }
});

app.post("/move", (req, res) => {
  // add authorization

  const player = players.find((player) => player.id === req.body.id);
  const lastMove = getLastMove().number;
  const thisMove = Math.round((lastMove + req.body.move) / 3);

  if (thisMove) {
    moves.push({
      id: player.id,
      createdAt: Date.now(),
      number: thisMove,
    });

    if (thisMove === 1) {
      endGame(player.id);
    }

    res.status(201).json();
  } else {
    res.status(503).json();
  }
});

app.get("/moves", (_req, res) => {
  const lastMove = getLastMove();

  const isPast2minsSinceLastMove =
    Math.abs(Date.now() - lastMove.createdAt) / 60000 > maxMinsToPlay;

  if (lastMove && maxPlayersReached && isPast2minsSinceLastMove) {
    endGame(lastMove.id);
  }

  res.status(200).json({
    moves,
    maxPlayersReached,
    gameInSession,
    winnerId: winner,
  });
});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

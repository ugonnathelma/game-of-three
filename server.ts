const express = require("express");
const app = express();
const port = 3001;
const maxSecsToPlay = 120;

let players = [];
let moves = [];
let winner = null;
let gameInSession = false; // game has started
let maxPlayersReached = false; // game has maximum number of players

const getLastMove = () => moves[moves.length - 1];

const endGame = (playerId) => {
  winner = playerId;
  gameInSession = false;
  maxPlayersReached = false;
  players = [];
};

const startGame = (playerId) => {
  const newPlayer = {
    id: playerId,
  };
  players.push(newPlayer);

  // set game to full once there are two players...
  // implementation for future: have different game sessions to allow more users play simultaneously
  if (players.length >= 2) {
    maxPlayersReached = true;
  }

  if (!gameInSession) {
    winner = null;
    moves = [];

    // make first move with random number between 10 and 100
    const numberPlayed = Math.floor(Math.random() * (100 - 10 + 1) + 10);

    moves.push({
      createdAt: Date.now(),
      id: playerId,
      number: numberPlayed,
    });

    // start game
    gameInSession = true;
  }
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

    startGame(playerId);

    res.status(201).json({
      id: playerId,
      moves,
    });
  }
});

app.post("/move", (req, res) => {
  const player = players.find((player) => player.id === req.body.id);
  if (player) {
    const lastMoveNumber = getLastMove().number;
    const thisMoveNumber = Math.round((lastMoveNumber + req.body.move) / 3);

    if (thisMoveNumber) {
      const newMove = {
        id: player.id,
        createdAt: Date.now(),
        number: thisMoveNumber,
      };
      moves.push(newMove);

      if (thisMoveNumber === 1) {
        endGame(player.id);
      }

      res.status(201).json(newMove);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(401).json({
      error: { message: "You are not a player in this game" },
    });
  }
});

app.get("/moves", (req, res) => {
  const player = players.find((player) => player.id === req.query.id);
  if (player) {
    const lastMove = getLastMove();

    if (lastMove) {
      const diff = Math.floor(Math.abs(Date.now() - lastMove.createdAt) / 1000);

      const isPast2minsSinceLastMove = diff > maxSecsToPlay;

      // only check time left if game is started and more than one player in game
      // end game is more than 2mins since last play
      if (gameInSession && maxPlayersReached && isPast2minsSinceLastMove) {
        endGame(lastMove.id);
      }

      res.status(200).json({
        moves,
        maxPlayersReached,
        gameInSession,
        winnerId: winner,
        timeLeft: maxSecsToPlay - diff,
      });
    } else {
      res.status(401).json({
        error: { message: "You are not a player in this game" },
      });
    }
  }
});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

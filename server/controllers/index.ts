const moveOptions = [-1, 0, 1];
const maxSecsToPlay = 120;
let maxPlayersReached = false; // game has maximum number of players
let winner = null;
let gameInSession = false; // game has started
let players = [];
let moves = [];
let gameType = "";
const getLastMove = () => moves[moves.length - 1];

// <------ utils starts here ------->

const endGame = (playerId: string) => {
  winner = playerId;
  players = [];
  gameInSession = false;
  maxPlayersReached = false;
  gameType = "";
};

const makeMove = (number: number, playerId: string) => {
  const lastNumberPlayed = getLastMove().number;

  const isDivisibleBy3 = (lastNumberPlayed + number) % 3 === 0;

  let formula = `(${lastNumberPlayed} + ${number})`;

  let currentNumberPlayed = lastNumberPlayed + number;

  if (isDivisibleBy3) {
    currentNumberPlayed = Math.floor(currentNumberPlayed / 3);
    formula += " / 3";
  }

  const newMove = {
    id: playerId,
    createdAt: Date.now(),
    formula,
    number: currentNumberPlayed,
  };

  moves.push(newMove);

  if (currentNumberPlayed === 1) {
    endGame(playerId);
  }
};

const playComputerVsComputer = async () => {
  const lastMove = getLastMove();
  while (lastMove.number > 1) {
    const nextToPlay = players.find((player) => player.id !== lastMove.id);
    const randomIndex = Math.floor(Math.random() * 3);

    makeMove(moveOptions[randomIndex], nextToPlay.id);
  }
};

const startGame = (playerId: string) => {
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

// <------ utils end here ------->

const newMove = (req, res) => {
  const player = players.find((player) => player.id === req.body.id);
  if (player) {
    if (moveOptions.includes(req.body.move)) {
      makeMove(req.body.move, player.id);

      if (gameType === "comp-human") {
        const nextToPlay = players.find((player) => player.id !== req.body.id);
        const randomIndex = Math.floor(Math.random() * 3);

        makeMove(moveOptions[randomIndex], nextToPlay.id);
      }
    } else {
      res.status(400).json({
        error: { message: "Move is invalid" },
      });
    }
  } else {
    res.status(401).json({
      error: { message: "You are not a player in this game" },
    });
  }
};

const getMoves = (_req, res) => {
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
};

const joinGame = (req, res) => {
  console.log("got here");
  if (maxPlayersReached) {
    res.status(503).json({
      error: { message: "Game is already full! Try again later" },
    });
  } else {
    // generate player id
    const playerId = Math.random().toString(36).substring(2, 15);
    startGame(playerId);

    const playerId2 = Math.random().toString(36).substring(2, 15);
    startGame(playerId2);

    res.status(201).json({
      id: playerId2,
      moves,
    });

    gameType = req.query.gameType;

    req.query.gameType === "comp-comp" && playComputerVsComputer();
  }
};

module.exports = {
  newMove,
  getMoves,
  joinGame,
  maxPlayersReached,
};

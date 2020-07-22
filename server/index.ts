import express, { NextFunction, Request, Response } from "express";

const controllers = require("./controllers/index.ts");

const app = express();
const port = 3001;

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.append("Access-Control-Allow-Origin", "http://localhost:3000");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.post("/", (_req: Request, res: Response) => {
  if (controllers.maxPlayersReached) {
    res.status(503).json({
      error: { message: "Game is already full! Try again later" },
    });
  } else {
    res.sendStatus(200);
  }
});

app.post("/start", controllers.joinGame);

app.post("/move", controllers.newMove);

app.get("/moves", controllers.getMoves);

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

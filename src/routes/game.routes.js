import { Router } from "express";
import { validateSchema } from "../middlewares/schemaValidation.js";
import { gameSchema } from "../schemas/game.schemas.js";

const gameRouter = Router();

gameRouter.get("/games", listGames);
gameRouter.post("/games", validateSchema(gameSchema), createGame);

export default gameRouter;
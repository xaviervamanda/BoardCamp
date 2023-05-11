import { Router } from "express";
import { validateSchema } from "../middlewares/schemaValidation.js";
import {rentalSchema} from "../schemas/rentals.schemas.js";
import { listRentals, createRental } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", listRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental);
// rentalsRouter.post("/rentals/:id/return", returnRental);
// rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
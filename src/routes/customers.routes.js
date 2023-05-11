import { Router } from "express";
import { validateSchema } from "../middlewares/schemaValidation.js";
import {customerSchema} from "../schemas/customers.schemas.js";
import { addCustomer, listCustomers } from "../controllers/customers.controllers.js";

const customerRouter = Router();

customerRouter.get("/customers", listCustomers);
// customerRouter.get("/customers/:id", getCustomerById);
customerRouter.post("/customers", validateSchema(customerSchema), addCustomer);
// customerRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer);

export default customerRouter;
import { Router } from "express";
import { validateSchema } from "../middlewares/schemaValidation.js";
import {customerSchema} from "../schemas/customers.schemas.js";

const customerRouter = Router();

customerRouter.get("/customers", listCustomers);
customerRouter.get("/customers/:id", getCustomerById);
customerRouter.post("/customers", validateSchema(customerSchema), createCustomer);
customerRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer);

export default customerRouter;
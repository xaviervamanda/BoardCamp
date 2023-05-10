import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
dotenv.config();


const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));
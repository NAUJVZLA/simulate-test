import "./config/container";
import express, { Express } from "express";
import routes from "./routes/routes";
import Util from "./utils/util";
import cors from "cors";

const app: Express = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,DELETE,UPDATE",
    credentials: true
}))
const PORT: number = 3060;
app.use(express.json());
app.use("/api", routes);

Util.startServer(app, PORT);


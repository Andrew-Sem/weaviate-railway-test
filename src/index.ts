import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { WeaviateService } from "./WeaviateService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const weaviateService = new WeaviateService();

app.post("/init", async (req, res) => {
  await weaviateService.init();
  res.send("init ok");
});

app.get("/getData", async (req, res) => {
  const data = await weaviateService.getData();
  res.send(data);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

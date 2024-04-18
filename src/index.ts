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

app.get("/", async (req, res) => {
  res.send("I'm alive");
});

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  const data = await weaviateService.getData()
  console.log(data)
});

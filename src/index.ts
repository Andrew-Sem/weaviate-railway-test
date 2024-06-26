import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { WeaviateService } from "./WeaviateService";
import { OldWeaviateService } from "./OldWeaviateService";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const weaviateService = new WeaviateService();
const oldWeaviateService = new OldWeaviateService();

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

app.get("/oldWeaviate/getData", async (req, res) => {
  const data = await oldWeaviateService.getData()
  console.log(data)
  res.send(data)
})

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  if (process.env.NODE_ENV === 'production')
    await new Promise(resolve => setTimeout(resolve, 3000));
  await weaviateService.init()
  await oldWeaviateService.init()
});

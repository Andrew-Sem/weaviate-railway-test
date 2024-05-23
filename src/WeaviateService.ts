import OpenAI from "openai";
import weaviate, { WeaviateClient } from "weaviate-client";

type Todo = {
  name: string;
  description: string;
};

export class WeaviateService {
  private _weaviateClient: WeaviateClient | null = null;

  private async getWeaviateClient() {
    if (!this._weaviateClient) {
      // self-hosted in production and WCS in development
      // if (process.env.NODE_ENV === "production") {
      //   this._weaviateClient = await weaviate.connectToLocal({
      //     httpHost: process.env.WEAVIATE_HOST,
      //     httpPort: 8080,
      //     httpSecure: false,
      //     grpcHost: process.env.WEAVIATE_HOST,
      //     grpcPort: 50051,
      //     grpcSecure: false,
      //     headers: {
      //       "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY ?? "",
      //     },
      //   });
      // } else {
        this._weaviateClient = await weaviate.connectToWCS(
          process.env.WEAVIATE_HOST ?? "",
          {
            authCredentials: new weaviate.ApiKey("api key"),
            headers: {
              "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY ?? "",
            },
          }
        );
      // }
    }
    return this._weaviateClient;
  }

  async init() {
    if (process.env.NODE_ENV === 'production')
      await new Promise(resolve => setTimeout(resolve, 3000));
    const todosCollection = await (
      await this.getWeaviateClient()
    ).collections.create({
      name: "Todo",
      vectorizer: weaviate.configure.vectorizer.text2VecOpenAI({
        model: "text-embedding-3-small",
      }),
      properties: [
        { name: "name", dataType: "text" },
        { name: "description", dataType: "text" },
      ],
    });

    const data: Todo[] = [
      { name: "buy milk", description: "I'm really wanna milk" },
      { name: "go to the gym", description: "It's open until 9" },
    ];

    await todosCollection.data.insertMany(data);
  }

  async getData() {
    const res = await (await this.getWeaviateClient()).collections
      .get("Todo")
      .query.fetchObjects();
    return res.objects;
  }
}

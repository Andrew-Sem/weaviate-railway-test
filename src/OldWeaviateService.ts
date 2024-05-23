import { FormData } from "openai/_shims/auto/types";
import weaviate, { ApiKey, WeaviateClient } from "weaviate-ts-client"
type Todo = {
  name: string;
  description: string;
};

const schema = {
    classes: [
      {
        class: "Article",
        description: "A collection of articles",
        properties: [
          {
            name: "title",
            dataType: ["text"],
            description: "The title of the article",
          },
          {
            name: "content",
            dataType: ["text"],
            description: "The content of the article",
          },
        ],
      },
    ],
  };

export class OldWeaviateService {
  private client: WeaviateClient

  constructor(){
    this.client = weaviate.client({
        host: process.env.WEAVIATE_HOST ?? "",
        apiKey: new ApiKey(process.env.WEAVIATE_API_KEY!)
      });
  }

  async init() {
    this.client.schema
    .classCreator()
    .withClass(schema.classes[0])
    .do()
    .then((res) => {
      console.log("Schema created:", res);
    })
    .catch((err) => {
      console.error("Error creating schema:", err);
    });
    const article = {
        class: "Article",
        properties: {
          title: "Hello World",
          content: "This is an example article for Weaviate.",
        },
      };

      this.client.data
  .creator()
  .withClassName(article.class)
  .withProperties(article.properties)
  .do()
  .then((res) => {
    console.log("Article created:", res);
  })
  .catch((err) => {
    console.error("Error creating article:", err);
  });
  }

  async getData() {
    const query = {
        class: "Article",
        fields: ["title", "content"],
      };
    const data = await this.client.graphql.get().withClassName(query.class).withFields(query.fields.join(" ")).do()
    return data
  }
}

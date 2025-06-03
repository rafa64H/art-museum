import request from "supertest";
import { app } from "../../app";

describe("Search feature for posts", () => {
  const accessToken = "";
  test("Search posts (GET /api/posts/search?queries", async () => {
    const scenario = "default";
    const response = await request(app)
      .get("/api/posts/search?")
      .set("Authorization", `Bearer ${accessToken}`);
  });
});

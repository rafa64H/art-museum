import request from "supertest";
import { app } from "../../app";

describe("Search feature for posts", () => {
  const query = "mathematics+computer+art";
  test("Search posts (GET /api/posts/search?queries", async () => {
    const scenario: "success" | "failure" = "success";
    const response = await request(app).get(`/api/posts/search?q=${query}`);
    if (scenario === "success") {
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.results).toBeInstanceOf(Array);
    }
  });
});

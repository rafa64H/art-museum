import request from "supertest";
import { app } from "../../app";

describe("Search feature for posts", () => {
  test("Search posts (GET /api/posts/search/by-text?q={}", async () => {
    const scenario: "success" | "failure" = "success";
    const query = "mathematics+computer";

    const response = await request(app).get(
      `/api/posts/search/by-text?q=${query}`
    );
    if (scenario === "success") {
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.results).toBeInstanceOf(Array);
    }
  });

  test("Search posts by tag (GET /api/posts/search/by-tags?qTags={}&findAllOrAny={}", async () => {
    const scenario: "success" | "failure" = "success";
    const query = "react";
    const findAllOrAnyParam = "all";

    const response = await request(app).get(
      `/api/posts/search/by-tags?qTags=${query}&findAllOrAny=${findAllOrAnyParam}`
    );
    if (scenario === "success") {
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.results).toBeInstanceOf(Array);
    }
  });
});

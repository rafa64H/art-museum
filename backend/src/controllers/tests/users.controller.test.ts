import request from "supertest";
import { app } from "../../app";

describe("Adding/Removing follower or following", async () => {
  const accessToken = "";
  test.skip("addFollower (POST /api/users/:userId/followers)", async () => {
    const scenario: "add-follower" | "already-follower" = "add-follower";
    const response = await request(app)
      .post("/api/users/:userId/followers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ userIdFollower: "{userId}" });

    if (scenario === "add-follower") {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("is now being followed by");
    } else {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("is already a follower of");
    }
  });

  test.skip("removeFollower (DELETE /api/users/:userId/followers/:userIdFollower)", async () => {
    const scenario: "remove-follower" | "not-follower" = "remove-follower";
    const response = await request(app)
      .post("/api/users/:userId/followers")
      .set("Authorization", `Bearer ${accessToken}`);

    if (scenario === "remove-follower") {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("unfollowed");
    } else {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("is not being followed by");
    }
  });

  test.skip("addFollowing (POST /api/users/:userId/following)", async () => {
    const scenario: "add-following" | "already-following" = "add-following";
    const response = await request(app)
      .post("/api/users/:userId/following")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userIdFollowing: "userId",
      });

    if (scenario === "add-following") {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("is now being followed by");
    } else {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("is already a follower of");
    }
  });

  test.skip("removeFollowing (DELETE /api/users/:userId/following/:userIdFollowing)", async () => {
    const scenario: "remove-following" | "not-following" = "remove-following";
    const response = await request(app)
      .delete("/api/users/:userId/following/:userIdFollowing")
      .set("Authorization", `Bearer ${accessToken}`);

    if (scenario === "remove-following") {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("unfollowed");
    } else {
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("is not being followed by");
    }
  });
});

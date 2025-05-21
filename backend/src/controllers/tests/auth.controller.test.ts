import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

describe("Login", () => {
  test("POST /auth/login", async () => {
    const responseLogin = await request(app).post("/auth/login").send({
      emailOrUsername: "rafaelpache64@outlook.com",
      password: "aenoaelol543a4$",
    });
    expect(responseLogin.statusCode).toBe(200);
    expect(responseLogin.body.accessToken);
    console.log(responseLogin.body.accessToken);
  });
});

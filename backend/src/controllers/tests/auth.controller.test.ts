import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

describe.skip("Sign up and login", () => {
  let email = "";
  let name = "";
  let username = "";
  let password = "";
  let confirmPassword = "";
  let emailOrUsername = "";
  test.skip("POST /auth/signup", async () => {
    const scenario = "";
    const responseSignUp = await request(app).post("/auth/signup").send({
      email: "rafaelpache64@outlook.com",
      name: "Rafael Pacheco",
      username: "rafa64H",
      password: "aenoaelol543a4$",
    });
  });

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

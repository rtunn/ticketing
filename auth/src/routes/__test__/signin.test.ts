import request from "supertest";
import { app } from "../../app";
import signup from "../../test/auth-helper";

it("returns 200 with valid credentials", async () => {
  await signup();
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("fails when email does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "notexist@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when incorrect password", async () => {
  await signup();
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "pass",
    })
    .expect(400);
});

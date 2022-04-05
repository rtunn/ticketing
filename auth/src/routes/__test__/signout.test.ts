import request from "supertest";
import { app } from "../../app";
import signup from "../../test/auth-helper";

it("clears the cookie after signing out", async () => {
  await signup();
  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toBe(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});

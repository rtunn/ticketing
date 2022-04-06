import request from "supertest";
import { app } from "../../app";
import signup from "../../test/auth-helper";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", signup()).send({
    title: "asldkf",
    price: 20,
  });
};

it("returns a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});

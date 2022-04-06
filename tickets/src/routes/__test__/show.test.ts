import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import signup from "../../test/auth-helper";

it("returns 400 for invalid id format", async () => {
  await request(app).get("/api/tickets/afdsadjfo").send().expect(400);
});

it("returns 404 if ticket not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns ticket if ticket found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

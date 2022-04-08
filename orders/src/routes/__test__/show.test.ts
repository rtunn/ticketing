import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import signup from "../../test/auth-helper";

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString("hex"),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = signup();

  const { body: order } = await request(app)
    .post(`/api/orders/`)
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(order.id);
});

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString("hex"),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = signup();

  const { body: order } = await request(app)
    .post(`/api/orders/`)
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(order.id);
});

it("returns 404 if user doesn't own order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString("hex"),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = signup();

  const { body: order } = await request(app)
    .post(`/api/orders/`)
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signup())
    .send()
    .expect(404);
});

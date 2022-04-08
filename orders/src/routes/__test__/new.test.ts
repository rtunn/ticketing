import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import signup from "../../test/auth-helper";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if ticket not exists", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({ ticketId })
    .expect(404);
});

it("returns 400 if ticket reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString("hex"),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "adfjdsafao",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString("hex"),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString("hex"),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@rtticketing/common";
import { app } from "../../app";
import signup from "../../test/auth-helper";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if order does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signup())
    .send({
      token: "adfsaj",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 if order does not belong to user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup())
    .send({
      token: "adfsaj",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 if order is cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 1,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(userId))
    .send({
      token: "adfsaj",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs and saves payment", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeList = await stripe.charges.list({ limit: 10 });
  const stripeCharge = chargeList.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

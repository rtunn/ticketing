import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import signup from "../../test/auth-helper";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signup())
    .send({
      title: "asdlkf",
      price: 20,
    })
    .expect(404);
});

it("returns 401 if user not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdlkf",
      price: 20,
    })
    .expect(401);
});

it("returns 401 if user does not own ticket", async () => {
  const title = "asldkfj";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signup())
    .send({
      title: "derpderp",
      price: 15,
    })
    .expect(401);

  const ticket = await Ticket.findById(response.body.id);
  expect(ticket!.title).toEqual(title);
  expect(ticket!.price).toEqual(price);
});

it("returns 400 if user provides invalid title or price", async () => {
  const title = "asldkfj";
  const price = 20;
  const cookie = signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 15,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "adfdsa",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket with valid inputs", async () => {
  const title = "asldkfj";
  const price = 20;
  const cookie = signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "foobar",
      price: 15,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  const ticket = await Ticket.findById(response.body.id);
  expect(ticket!.title).toEqual(title);
  expect(ticket!.price).toEqual(price);
});

it("publishes an event", async () => {
  const title = "asldkfj";
  const price = 20;
  const cookie = signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "foobar",
      price: 15,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

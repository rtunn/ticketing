import request from "supertest";
import { app } from "../../app";
import signup from "../../test/auth-helper";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns non-401 status if user signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns error if invalid title provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns error if invalid price provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "afdsaf",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "adfaij",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "afdsaf";
  const price = 20;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

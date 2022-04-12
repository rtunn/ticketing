import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rtticketing/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // calculate expiresAt
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + parseInt(process.env.EXPIRATION_WINDOW_SECONDS!)
    );

    // Build the order and save
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    console.log(`Order ID: ${order.id} expires at ${expiration}`);

    // Publish order created event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };

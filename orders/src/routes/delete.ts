import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rtticketing/common";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Invalid orderId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.currentUser!.id,
    }).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };

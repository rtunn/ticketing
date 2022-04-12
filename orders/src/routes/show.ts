import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@rtticketing/common";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId").isMongoId().withMessage("Invalid orderId"),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.currentUser!.id,
    }).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    console.log("Orders Service responding with orderId", order.id);
    res.send(order);
  }
);

export { router as showOrderRouter };

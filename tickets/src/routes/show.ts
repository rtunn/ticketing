import express, { Request, Response } from "express";
import { param } from "express-validator";
import { Ticket } from "../models/ticket";

import { NotFoundError, validateRequest } from "@rtticketing/common";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  param("id").isMongoId().withMessage("Invalid id format"),
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { router as ShowTicketRouter };

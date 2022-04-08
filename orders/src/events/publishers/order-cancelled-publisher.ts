import { Publisher, OrderCancelledEvent, Subjects } from "@rtticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

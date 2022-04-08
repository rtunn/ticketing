import { Publisher, OrderCreatedEvent, Subjects } from "@rtticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

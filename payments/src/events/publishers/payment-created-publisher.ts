import { Publisher, Subjects, PaymentCreatedEvent } from "@rtticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

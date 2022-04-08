import { Publisher, Subjects, TicketUpdatedEvent } from "@rtticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

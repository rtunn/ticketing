import { Publisher, Subjects, TicketCreatedEvent } from "@rtticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

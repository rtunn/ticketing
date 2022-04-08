import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@rtticketing/common";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-svc";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data: ", data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}

export default TicketCreatedListener;

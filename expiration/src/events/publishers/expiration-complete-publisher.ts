import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@rtticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

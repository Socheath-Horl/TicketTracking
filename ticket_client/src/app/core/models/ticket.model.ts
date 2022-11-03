import { TicketTypeEnum } from "./ticket-type.enum";

export interface Ticket {
  Id: string;
  Description: string;
  Summary: string;
  Severity: boolean;
  Priority: boolean;
  TicketType: TicketTypeEnum;
}
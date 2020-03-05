export type Person = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export enum Attendance {
  ATTENDING,
  NOT_ATTENDING,
  MAYBE,
  NO_RESPONSE
}

export type Invitation = {
  id: number;
  guest: Person;
  event_id: number;
  attendance: Attendance;
};

export type Event = {
  id: number;
  title: string;
  description: string;
  date_of_event: string;
  time_of_event: string;
  location: string;
};

export type EventInput = {
  host?: HostInput;
  title?: string;
  description?: string;
  date_of_event?: string;
  time_of_event?: string;
  location?: string;
  invitations?: Array<InvitationInput>;
};

export type InvitationInput = {
  id?: number;
  attendance?: Attendance;
  event_id?: number;
  guest: GuestInput;
};

export type GuestInput = {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
};

export type HostInput = {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  __typeName?: string;
};

export type QueryResponse = {
  loading?: any;
  error?: any;
  data?: any;
};

export type MutationResponse = {
  id: number;
  message: string;
};

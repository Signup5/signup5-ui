import {emailRegEx} from "../Utility";

export type Person = {
  id: number;
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

export interface EventInput {
  host: HostInput;
  title: string;
  description?: string;
  date_of_event: string;
  time_of_event: string;
  location: string;
  invitations?: Array<InvitationInput>;
}

export interface InvitationInput {
  id?: number;
  attendance?: Attendance;
  event_id?: number;
  guest: GuestInput;
}

export interface GuestInput {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface HostInput {
  id: number;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export type QueryResponse = {
  loading?: any;
  error?: any;
  data?: any;
};

export type MutationResponse = {
  id: number;
  message: string;
};

export class Credentials {
  private email: string;
  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  setEmail(email: string) {
    this.email = email;
  }

  getEmail() {
    return this.email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  getPassword() {
    return this.password;
  }

  isEmailValidFormat() {
    return this.email.match(emailRegEx);
  }

  isPasswordValidFormat() {
    return this.password.length >= 4;
  }
}

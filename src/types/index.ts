export type User = {
  id: string;
  email: string;
  profileSetup: boolean;
  firstName?: string;
  lastName?: string;
  color?: string;
};

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  color?: string;
  lastMessageTime?: string;
}

export interface Message {
  _id?: string;
  id?: string;
  sender: string | User;
  recipient: string | User;
  content: string;
  messageType?: string;
  timestamp: string;
}

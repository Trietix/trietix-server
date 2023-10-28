import mongoose, { Model, Document } from 'mongoose';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  username: string;
  email: string;
  name: string;
  password: string;
  role: string;
  eventsAttended: any[],
  eventsPaid: string[],
  invitations: string[],
  tickets: any[],
  events: any[],
  volunteer: string,
  photo: string;
  phoneNumber: string;
  accountNumber: number;
  accountName: string;
  bank: string;
  isVerified: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = IUser;

export type NewCreatedUser = IUser;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;     
}

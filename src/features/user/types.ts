export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  PUBLISHER = "PUBLISHER",
  MODERATOR = "MODERATOR",
}

export enum AccountStatus {
  NOT_VERIFY = "NOT_VERIFY",
  VERIFIED = "VERIFIED",
  BANNED = "BANNED",
}

export interface IUser {
  id: string;
  role: UserRole;
  username: string;
  email: string;
  avatar?: string | null;
  accountStatus: AccountStatus;
  activeDevices: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  googleID?: string | null;
  facebookID?: string | null;
  provider?: string | null;
}

export interface IUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: AccountStatus;
}


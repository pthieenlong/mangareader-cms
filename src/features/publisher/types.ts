export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  PENDING = "PENDING",
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IPublisherUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  accountStatus: AccountStatus;
  createdAt: Date;
}

export interface IPublisherApplication {
  id: string;
  userId: string;
  user: IPublisherUser;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  reason: string;
  personalStoryFiles: string[] | null;
  status: ApplicationStatus;
  adminNotes?: string | null;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPendingPublishersParams {
  page?: number;
  limit?: number;
}

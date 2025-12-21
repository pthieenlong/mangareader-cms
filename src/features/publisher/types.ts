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
  cccdNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  placeOfOrigin: string;
  placeOfResidence: string;
  expiryDate: string;
  cccdFrontImage: string;
  cccdBackImage: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPendingPublishersParams {
  page?: number;
  limit?: number;
}

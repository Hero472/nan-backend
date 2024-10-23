import { BlockEnum, DayEnum, LevelEnum } from "./enum";

export type UserSend = {
  name: string;
  access_token: string | null;
  refresh_token: string | null;
  user_type: UserType;
};

export enum UserType {
  Admin = 'admin',
  Professor = 'professor',
  Parent = 'parent',
  Student = 'student',
}

export type StudentSend = {
  name: string;
  access_token: string;
  refresh_token: string;
};

export type StudentSendFromParent = {
  name: string,
  level: LevelEnum,
}

export type SubjectSend = {
  id_subject: number,
  name: string,
  level: LevelEnum,
  day: DayEnum,
  block: BlockEnum
}
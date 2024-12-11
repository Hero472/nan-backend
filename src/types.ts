import { BlockEnum, DayEnum, LevelEnum } from "./enum";

export type UserSend = {
  id: number;
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
  level: LevelEnum;
  email: string;
};

export type StudentSubjectSendIdSubject = {
  id_student: number,
  name: string,
}

export type StudentSubjectSendIdStudent = {
  id_subject: number,
  name: string,
}

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

export type SubjectProfSend = {
  name: string,
  level: LevelEnum
}

export type ParentStudentSend = {
  name: string,
  level: LevelEnum
}

export type GradeSend = {
  id_grade: number,
  student_name: string,
  subject_name: string,
  grade: number,
  level: LevelEnum,
  year: number
}
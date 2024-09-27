export type UserSend = {
  id_user: number;
  name: string;
  access_token: string;
  refresh_token: string;
  user_type: UserType;
};

export enum UserType {
  Admin = 4,
  Professor = 3,
  Parent = 2,
  Student = 1,
}

import { User } from "../infra/typeorm/entities/User";

export interface IUsersTokens {
  id: string;
  refresh_token: string;
  user_id: string;
  user: User;
  expires_date: Date;
  created_at: Date;
}
import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UsersTokens } from "../infra/typeorm/entities/UsersTokens";

export interface IUsersTokensRepository {
  create({ 
    user_id,
    expires_date,
    refresh_token
  }: ICreateUserTokenDTO): Promise<UsersTokens>

  findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UsersTokens>
  deleteById(id: string): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<UsersTokens>;
}
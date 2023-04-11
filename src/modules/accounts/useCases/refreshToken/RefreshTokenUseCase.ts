import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayLoad {
  sub: string;
  email: string
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const decode = verify(token, auth.secret_refresh_token) as IPayLoad;
    const user_id = decode.sub;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

    if(!userToken) {
      throw new Error("Refresh Token does not exists!")
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email: decode.email }, auth.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.expires_in_refresh_token
    });

    const expires_date = this.dayjsDateProvider.addDays(
      auth.expires_refresh_token_days
    )

    await this.usersTokensRepository.create({
      expires_date,
      refresh_token,
      user_id
    })

    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token
    });

    return {
      token: newToken,
      refresh_token
    }
  }
}
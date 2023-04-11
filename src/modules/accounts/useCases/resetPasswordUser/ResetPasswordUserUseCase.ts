import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

interface IRequest {
  token: string,
  password: string
}

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ){}

  async execute({ token, password }: IRequest) {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token);

    if(!userToken) {
      throw new Error("Token invalid!")
    }

    const isTokenExpired = this.dateProvider
      .compareIfBefore(userToken.expires_date, this.dateProvider.dateNow()) 

    if(isTokenExpired) {
      throw new Error("Token expired!")
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}
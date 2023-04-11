import auth from "@config/auth";
import { IRequestAuthenticateUserUseCaseDTO, IResponseAuthenticateUserUseCaseDTO } from "@modules/accounts/dtos/UsersRepositoryDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

/** NOTE TSyringe
 * @injectable() é um decorador que é aplicado a uma classe para 
 * indicar que ela pode ser "injetada". 
 * 
 * A string é um token utilizado para identicar dentro do
 * container a classe que deve ser instanciada. 
 * "src/shared/container/index.ts"
 */

/** NOTE JWT
 * 1 - Verificar se o usuário existe
 * 2 - Verificar se a senha está correta
 * 3 - Gerar jsonwebtoken e retorna-lo
 */

@injectable()
class AuthenticateUserUseCase {
  
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) {}
  
  async execute({ 
    email, 
    password 
  }: IRequestAuthenticateUserUseCaseDTO): Promise<IResponseAuthenticateUserUseCaseDTO> {

    const user =  await this.usersRepository.findByEmail(email);
    const msgError = "Email or password incorrect!"

    if(!user) {
      throw new Error(msgError);
    }

    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch) {
      throw new Error(msgError);
    }

    const token = sign({}, auth.secret_token, {
      subject: user.id,
      expiresIn: auth.expires_in_token
    });

    const refresh_token_expires_date = this.dayjsDateProvider.addDays(
      auth.expires_refresh_token_days
    )

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user.id,
      expiresIn: auth.expires_in_refresh_token
    });

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date
    })

    const tokenReturn: IResponseAuthenticateUserUseCaseDTO = {
      token,
      user: {
        name: user.name,
        email: user.email
      },
      refresh_token
    }

    return tokenReturn
  }
}

export { AuthenticateUserUseCase };

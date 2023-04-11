import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { resolve as resolvePath } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class  SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokenRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider,

    @inject("MailProvider")
    private mailProvider: IMailProvider
  ){}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    const templatePath = resolvePath(
      __dirname,
      "..", "..",
      "views",
      "emails",
      "forgotPassword.hbs"
    );

    if(!user) {
      throw new Error("User does not exists!");
    }

    const token = uuidv4();

    const expires_date = this.dayjsDateProvider.addHours(3);

    await this.usersTokenRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date
    });

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_EMAUL_URL}${token}`
    }

    await this.mailProvider.sendMail(
      email, 
      "Recuperação de senha", 
      variables,
      templatePath
    );
  }
}
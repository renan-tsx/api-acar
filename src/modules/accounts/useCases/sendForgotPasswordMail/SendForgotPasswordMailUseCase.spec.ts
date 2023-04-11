import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;
let dateProvider: DayjsDateProvider;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;

describe("Enviar email de recuperação de senha", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory;
    usersTokenRepositoryInMemory = new UsersTokensRepositoryInMemory;
    mailProvider = new MailProviderInMemory;
    dateProvider = new DayjsDateProvider;
    
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokenRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  })

  it("Deve ser capaz de enviar um email de senha esquecida", async () => {
    const sendEmail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      name: "user one",
      email: "user@email.com",
      driver_license: "ABC-000",
      password: "123"
    });

    await sendForgotPasswordMailUseCase.execute("user@email.com");

    expect(sendEmail).toHaveBeenCalled();
  });

  it("Não deve ser capaz de enviar um email de senha esquecida para usuário não existente", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("userNotExists@email.com")
    ).rejects.toEqual(new Error("User does not exists!"))
  });

  it("Deve ser capaz de criar um token de usuário", async () => {
    const tokenEmail = jest.spyOn(usersTokenRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      name: "user two",
      email: "usertwo@email.com",
      driver_license: "ABC-2222",
      password: "222"
    });

    await sendForgotPasswordMailUseCase.execute("usertwo@email.com");

    expect(tokenEmail).toHaveBeenCalled();
  });
});
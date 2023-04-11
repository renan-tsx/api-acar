
import { IUsersRepositoryDTO } from "@modules/accounts/dtos/UsersRepositoryDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUsecase";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUserCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;

describe("Autenticar usuário", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUserCase = new CreateUserUseCase(usersRepositoryInMemory);
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
  });

  it("Deve ser possível autenticar um usuário", async () => {
    const user: IUsersRepositoryDTO = {
      name: "Renan Moreira",
      email: "renan@email.com",
      password: "123",
      driver_license: "001x"
    }

    await createUserUserCase.execute(user);
    
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("Não Deve ser possível autenticar um usuário inexistente", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "marcos@email.com",
        password: "123"
      })
    ).rejects.toEqual(new Error("Email or password incorrect!"));
  });

  it("Não Deve ser possível autenticar um usuário com senha inválida", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "renan@email.com",
        password: "senha incorreta"
      })
    ).rejects.toEqual(new Error("Email or password incorrect!"));
  });
})
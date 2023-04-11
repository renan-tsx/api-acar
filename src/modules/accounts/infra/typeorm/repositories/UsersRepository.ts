import { getRepository, Repository } from "typeorm";
import { IUsersRepositoryDTO } from "../../../dtos/UsersRepositoryDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

/** NOTE Typeorm
 * Uma classe implementa uma interface e fornecer uma camada de abstração para 
 * acessar os dados de uma entidade no banco de dados.
 * 
 * Repository fornece uma estrutura básica para armazenar, recuperar e 
 * gerenciar dados da entidade passada como parâmetro.
 * 
 */

class UsersRepository implements IUsersRepository {

  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }
  
  async create({
    name,
    email,
    password,
    driver_license,
    avatar,
    id
  }: IUsersRepositoryDTO): Promise<User> {

    const user = this.repository.create({
      name,
      email,
      password,
      driver_license,
      avatar,
      id
    });

    await this.repository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }

  async list(id:string): Promise<User[]> {
    const user = await this.repository.findOne(id);

    const selectUser = `
      SELECT 
        id, 
        name, 
        email, 
        driver_license 
        ${user.is_admin ? ",is_admin" : ""} 
      FROM users 
      ORDER BY name`

    const users = this.repository.query(selectUser);
    return users;
  }
}

export { UsersRepository };

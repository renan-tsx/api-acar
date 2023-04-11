import { getRepository, Repository } from "typeorm";
import { ICreateSpecificationDTO, ISpecificationsRepository } from "../../../repositories/ISpecificationsRepository";
import { Specification } from "../entities/Specification";

/** NOTE Typeorm
 * Uma classe implementa uma interface e fornecer uma camada de abstração para 
 * acessar os dados de uma entidade no banco de dados.
 * 
 * Repository fornece uma estrutura básica para armazenar, recuperar e 
 * gerenciar dados da entidade passada como parâmetro.
 * 
 */

class SpecificationsRepository implements ISpecificationsRepository {
  private repository: Repository<Specification>

  constructor() {
    this.repository = getRepository(Specification);
  }

  async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create({
      name,
      description
    })

    await this.repository.save(specification);
    return specification;
  }

  async list(): Promise<Specification[]> {
    return await this.repository.find();
  }

  async findByName(name: string): Promise<Specification> {
    const specification = await this.repository.findOne({ name });
    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const specification = await this.repository.findByIds(ids);
    return specification;
  }
}

export { SpecificationsRepository };

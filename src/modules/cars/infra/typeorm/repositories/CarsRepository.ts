import { ICreateCarDTO, IRequestListCarsUseCaseDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { IcarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../entities/Car";

class CarsRepository implements IcarsRepository {

  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
    id
  }: ICreateCarDTO): Promise<Car> {
    
    const car = this.repository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
      id
    });

    await this.repository.save(car);

    return car;
  }
  
  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({license_plate});
    return car;
  }

  async findAvailable(param?: IRequestListCarsUseCaseDTO): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder("c")
      .where("available = :available", { available: true });

    if(param) {
      const { name, brand, category_id } = param;

      if(name) {
        carsQuery.andWhere("LOWER(c.name) ILIKE LOWER(:name)", { 
          name: `%${name}%`
        });
      }
 
      if(brand) {
        carsQuery.andWhere("LOWER(c.brand) ILIKE LOWER(:brand)", { 
          brand: `%${brand}%`
        });
      }

      if(category_id) {
        carsQuery.andWhere("c.category_id = :category_id", { category_id});
      }
    }

    const cars = await carsQuery.getMany(); 
    return cars;
  }

  async findById(car_id: string): Promise<Car> {
    const car = await this.repository.findOne(car_id)
    return car;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where("id = :id")
      .setParameters({ id })
      .execute()
  }
}

export { CarsRepository };

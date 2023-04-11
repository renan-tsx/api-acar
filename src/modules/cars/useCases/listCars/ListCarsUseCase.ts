import { IRequestListCarsUseCaseDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { IcarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { inject, injectable } from "tsyringe";

// REVIEW Tratar com try catch

@injectable()
class ListCarsUseCase {

  constructor(
    @inject("CarsRepository")
    private carsRepository: IcarsRepository
  ){}
  
  async execute(param?: IRequestListCarsUseCaseDTO): Promise<Car[]> {
    if(param) {
      const { name, brand, category_id } = param;
      
      const filteredCars = await this.carsRepository.findAvailable({
        name,
        brand,
        category_id
      });
      
      return filteredCars;
    }

    const allCarsAvailabre = await this.carsRepository.findAvailable();
    return allCarsAvailabre;
  }
}

export { ListCarsUseCase };

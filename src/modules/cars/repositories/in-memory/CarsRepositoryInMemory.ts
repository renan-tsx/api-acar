import { ICreateCarDTO, IRequestListCarsUseCaseDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { IcarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements IcarsRepository {
  cars: Car[] = [];

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications = [],
    id
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
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

    this.cars.push(car);
    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async findAvailable(param?: IRequestListCarsUseCaseDTO): Promise<Car[]> {
    
    if(param) {
      const { name, brand, category_id} = param;
      
      const filteredCars = this.cars.filter(car => 
        (car.available) && 
        (!name || car.name === name) &&
        (!brand || car.brand === brand) &&
        (!category_id || car.category_id === category_id)
      );

      return filteredCars;
    }
    
    const allCarsAvailabre = this.cars.filter(car => car.available === true);
    return allCarsAvailabre
  }

  async findById(car_id: string): Promise<Car> {
    return this.cars.find(car => car.id === car_id);
  }

  async updateAvailable(car_id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex(car => car.id === car_id);
    this.cars[findIndex].available = available;
  }
}

export { CarsRepositoryInMemory };

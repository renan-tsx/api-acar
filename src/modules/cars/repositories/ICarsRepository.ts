import { ICreateCarDTO, IRequestListCarsUseCaseDTO } from "../dtos/ICreateCarDTO";
import { Car } from "../infra/typeorm/entities/Car";

interface IcarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailable(param?: IRequestListCarsUseCaseDTO): Promise<Car[]>;
  findById(car_id: string): Promise<Car>;
  updateAvailable(car_id: string, available: boolean): Promise<void>;
}

export { IcarsRepository };

import { Specification } from "../infra/typeorm/entities/Specification";


export interface ICreateCarDTO {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
  specifications?: Specification[];
  id?: string;
}

export interface IRequestListCarsUseCaseDTO {
  name?: string;
  brand?: string;
  category_id?: string;
}

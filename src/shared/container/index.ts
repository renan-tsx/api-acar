
import { container } from "tsyringe";

import "@shared/container/providers";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { CategoriesRepository } from "@modules/cars/infra/typeorm/repositories/CategoriesRepository";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

import { SpecificationsRepository } from "@modules/cars/infra/typeorm/repositories/SpecificationsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";

import { CsvRepository } from "@modules/cars/infra/typeorm/repositories/CsvRepository";
import { ICsvRepository } from "@modules/cars/repositories/ICsvRepository";

import { CarsImagesRepository } from "@modules/cars/infra/typeorm/repositories/CarsImagesRepository";
import { CarsRepository } from "@modules/cars/infra/typeorm/repositories/CarsRepository";

import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { IcarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { RentalsRepository } from "@modules/rentals/infra/typeorm/repositories/RentalsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

/** NOTE TSyringe registerSingleton
 * 
 * CategoriesRepository e ICategoriesRepository é usado como exemplos, mas o
 * container pode conter outras classes.
 * 
 * Está sendo registrada uma classe chamada "CategoriesRepository" como uma 
 * instância única (singleton) no container de dependências, utilizando a 
 * interface "ICategoriesRepository". Isso significa que sempre que essa classe 
 * for requisitada pelo container, ele retornará a mesma instância, ao invés de 
 * criar uma nova a cada vez. 
 * 
 * Isso pode ser útil para garantir que sejam compartilhados os mesmos dados 
 * entre diferentes partes do aplicativo, sem que haja a necessidade de recriar 
 * a instância da classe a cada vez que for necessário acessar esses dados. 
 * Também pode ser útil para garantir que sejam usadas as mesmas configurações 
 * ou estado da classe em todas as partes do aplicativo
 */

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository
);

container.registerSingleton<ISpecificationsRepository>(
  "SpecificationsRepository",
  SpecificationsRepository
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<ICsvRepository>(
  "CsvRepository",
  CsvRepository
);

container.registerSingleton<IcarsRepository>(
  "CarsRepository",
  CarsRepository
);

container.registerSingleton<ICarsImagesRepository>(
  "CarsImagesRepository",
  CarsImagesRepository
);

container.registerSingleton<IRentalsRepository>(
  "RentalsRepository",
  RentalsRepository
);

container.registerSingleton<IUsersTokensRepository>(
  "UsersTokensRepository",
  UsersTokensRepository
);

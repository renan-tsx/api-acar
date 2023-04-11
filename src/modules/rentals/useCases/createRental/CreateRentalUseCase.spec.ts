
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Criar aluguel", () => {
  
  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
      );
  });

  it("Espero criar um novo aluguel", async () => {

    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Casr test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      brand: "brand",
      category_id: "123",
    })

    const rental = await createRentalUseCase.execute({
      user_id: "1",
      car_id: car.id,
      expected_return_date: dayjsDateProvider.dayAdd24Hours()
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("Espero não criar um novo aluguel caso existe um aluguel aberto para o usuário", async () => {

    const car = await carsRepositoryInMemory.create({
      id: "test1",
      name: "Test",
      description: "Casr test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      brand: "brand",
      category_id: "123",
    });

    const car2 = await carsRepositoryInMemory.create({
      id: "test2",
      name: "Test2",
      description: "Casr test2",
      daily_rate: 100,
      license_plate: "test2",
      fine_amount: 40,
      brand: "brand",
      category_id: "123",
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "123",
        car_id: car.id,
        expected_return_date: dayjsDateProvider.dayAdd24Hours()
      });

      await createRentalUseCase.execute({
        user_id: "123",
        car_id: car2.id,
        expected_return_date: dayjsDateProvider.dayAdd24Hours()
      });

    }).rejects.toThrow("There`s a rental in progress for user!");
  });

  it("Espero não criar um novo aluguel caso existe um aluguel aberto para o carro", async () => {

    const car = await carsRepositoryInMemory.create({
      id: "test1",
      name: "Test",
      description: "Casr test",
      daily_rate: 100,
      license_plate: "test",
      fine_amount: 40,
      brand: "brand",
      category_id: "123",
    });

    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "333",
        car_id: car.id,
        expected_return_date: dayjsDateProvider.dayAdd24Hours()
      });

      await createRentalUseCase.execute({
        user_id: "444",
        car_id: car.id,
        expected_return_date: dayjsDateProvider.dayAdd24Hours()
      });

    }).rejects.toThrow("Car is unavailable!");
  });

  it("Espero não criar um novo aluguel caso a duração seja menor que 24 horas", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "333",
        car_id: "888",
        expected_return_date: dayjsDateProvider.dateNow()
      });
    }).rejects.toThrow("Invalid return time!");
  });
  
});
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationRepositoryInMemory";
import { v4 as uuidv4 } from "uuid";
import { CreateCarUseCase } from "../createCar/CreateCarUseCase";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

describe("Criar especidicação do carro", () => {

  let carsRepositoryInMemory: CarsRepositoryInMemory;
  let specificationRepositoryInMemory: SpecificationRepositoryInMemory;

  let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
  let createCarUseCase: CreateCarUseCase;


  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationRepositoryInMemory = new SpecificationRepositoryInMemory();

    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationRepositoryInMemory
    );
    
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  })

  it("Espero que não adicione uma especificação para um carro não existente", async () => {
    const car_id = "1234";
    const specifications_id = ["4321"];

    await expect(
      createCarSpecificationUseCase.execute({ car_id, specifications_id})
    ).rejects.toEqual(new Error("Car does not exists!"));
  })

  it("Espero que adicione uma nova especificação", async () => {

      const car = await createCarUseCase.execute({
        id: uuidv4(),
        name: "Carro 6", 
        description: "Descrição do carro 6", 
        daily_rate: 100,
        license_plate: "ABC-6666",
        fine_amount: 60,
        brand: "Marca 6",
        category_id: "category 6"
      });

      expect(car).toHaveProperty("id");

      const specification = await specificationRepositoryInMemory.create({
        name: "Especificação name 1",
        description: "Especificação descrição 1"
      });

      const specificationCars =  await createCarSpecificationUseCase.execute({ 
        car_id: car.id, 
        specifications_id: [specification.id]
      });

      expect(specificationCars).toHaveProperty("specifications");
      expect(specificationCars.specifications.length).toBe(1);
  })

  it("Espero que não adicione uma especificação já existente", async () => {

    const car = await createCarUseCase.execute({
      id: uuidv4(),
      name: "Carro 6", 
      description: "Descrição do carro 6", 
      daily_rate: 100,
      license_plate: "ABC-6666",
      fine_amount: 60,
      brand: "Marca 6",
      category_id: "category 6"
    });

    const specification = await specificationRepositoryInMemory.create({
      name: "Especificação name 1",
      description: "Especificação descrição 1"
    });
    
    const specification2 = await specificationRepositoryInMemory.create({
      name: "Especificação name 2",
      description: "Especificação descrição 2"
    });
    
    const specificationCars =  await createCarSpecificationUseCase.execute({ 
      car_id: car.id, 
      specifications_id: [
        specification.id,
        specification2.id,
        specification.id,
        specification2.id
      ]
    });
    
    expect(car).toHaveProperty("id");
    expect(specificationCars).toHaveProperty("specifications");
    expect(specificationCars.specifications.length).toBe(2);
  })
})
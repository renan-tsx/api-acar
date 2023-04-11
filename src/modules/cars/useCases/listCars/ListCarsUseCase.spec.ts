import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { v4 as uuidv4 } from "uuid";
import { ListCarsUseCase } from "./ListCarsUseCase";

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Listar carros", () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  })

  it("Deve ser posssível listar os carros disponíveis", async() => {

    const car1 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Carro 1", 
      description: "Descrição 1", 
      daily_rate: 100,
      license_plate: "AAA-1111",
      fine_amount: 50,
      brand: "Marca 1",
      category_id: "category_id_1",
    });

    const car2 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Carro 2", 
      description: "Descrição 2", 
      daily_rate: 200,
      license_plate: "AAA-2222",
      fine_amount: 100,
      brand: "Marca 2",
      category_id: "category_id_2",
    });

    const cars = await listCarsUseCase.execute();

    expect(cars).toEqual([car1, car2]);

    cars.forEach(user => {
      const keys = Object.keys(user);
      expect(keys).toHaveLength(10);
            
      expect(user.id).toEqual(expect.any(String));
      expect(user.available).toBe(true);
      expect(user.name).toEqual(expect.any(String));
      expect(user.description).toEqual(expect.any(String));
      expect(user.daily_rate).toEqual(expect.any(Number));
      expect(user.license_plate).toEqual(expect.any(String));
      expect(user.fine_amount).toEqual(expect.any(Number));
      expect(user.brand).toEqual(expect.any(String));
      expect(user.category_id).toEqual(expect.any(String));
      expect(user.specifications).toEqual(expect.any(Array));
      
    });
  });

  it("Deve ser posssível listar os carros disponíveis por nome, marcar e id categoria", async() => {
    const car1 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Carro 1", 
      description: "Descrição 1", 
      daily_rate: 100,
      license_plate: "AAA-1111",
      fine_amount: 50,
      brand: "Marca 1",
      category_id: "category_id_1"
    });

    const car2 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Carro 2", 
      description: "Descrição 2", 
      daily_rate: 200,
      license_plate: "AAA-2222",
      fine_amount: 100,
      brand: "Marca 1",
      category_id: "category_id_2"
    });

    const car3 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Carro 3", 
      description: "Descrição 3", 
      daily_rate: 100,
      license_plate: "AAA-3333",
      fine_amount: 50,
      brand: "Marca 2",
      category_id: "category_id_1"
    });

    const car4 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Carro 4", 
      description: "Descrição 4", 
      daily_rate: 200,
      license_plate: "AAA-4444",
      fine_amount: 100,
      brand: "Marca 2",
      category_id: "category_id_2"
    });

    const car5 = await carsRepositoryInMemory.create({
      id: uuidv4(),
      name: "Carro 5", 
      description: "Descrição 5", 
      daily_rate: 200,
      license_plate: "AAA-5555",
      fine_amount: 100,
      brand: "Marca 2",
      category_id: "category_id_2"
    });

    const brandNameCategoryId = await listCarsUseCase.execute({brand: "Marca 2", name: "Carro 4", category_id: "category_id_2"});
    expect(brandNameCategoryId).toEqual([car4]);

    const brandName = await listCarsUseCase.execute({brand: "Marca 2", name: "Carro 3"});
    expect(brandName).toEqual([car3]);

    const brandCategoryId = await listCarsUseCase.execute({brand: "Marca 1", category_id: "category_id_2"});
    expect(brandCategoryId).toEqual([car2]);

    const nameCategoryId = await listCarsUseCase.execute({name: "Carro 5", category_id: "category_id_2"});
    expect(nameCategoryId).toEqual([car5]);

    const brand = await listCarsUseCase.execute({brand: "Marca 2"});
    expect(brand).toEqual([car3, car4, car5]);
    
    const name = await listCarsUseCase.execute({name: "Carro 5"});
    expect(name).toEqual([car5]);
    
    const categoryId = await listCarsUseCase.execute({category_id: "category_id_1"});
    expect(categoryId).toEqual([car1, car3]);

    [
      brandNameCategoryId,
      brandName,
      brandCategoryId,
      nameCategoryId,
      brand,
      name,
      categoryId
    ].forEach(array => {
      array.forEach(user => {
        const keys = Object.keys(user);
        expect(keys).toHaveLength(10);
  
        expect(user.id).toEqual(expect.any(String));
        expect(user.available).toBe(true);
        expect(user.name).toEqual(expect.any(String));
        expect(user.description).toEqual(expect.any(String));
        expect(user.daily_rate).toEqual(expect.any(Number));
        expect(user.license_plate).toEqual(expect.any(String));
        expect(user.fine_amount).toEqual(expect.any(Number));
        expect(user.brand).toEqual(expect.any(String));
        expect(user.category_id).toEqual(expect.any(String));
        expect(user.specifications).toEqual(expect.any(Array));

      });
    })
  });
})
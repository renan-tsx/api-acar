import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCarsUseCase } from "./ListCarsUseCase";

// REVIEW Tratar com try catch e refatorar a documentação

class ListCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, brand, category_id } = request.query;

    const listCarsUseCase = container.resolve(ListCarsUseCase);

    const cars = await listCarsUseCase.execute({ 
      name: name as string, 
      brand: brand as string, 
      category_id: category_id as string 
    })

    return response.json(cars);
  }
}

export { ListCarsController };

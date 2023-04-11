import { AppError } from "@shared/errors/AppError";
import HttpStatusCode from "@shared/errors/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

export class CreateCarSpecificationController {
  async handle(request: Request, response: Response) {

    try {
      const { id } = request.params;
      const { specifications_id } = request.body;
  
      const createCarSpecificationUseCase = container.resolve(
        CreateCarSpecificationUseCase
      )
  
      const cars = await createCarSpecificationUseCase.execute({
        car_id: id,
        specifications_id
      });
  
      return response.json(cars);
      
    } catch (error) {
      
      if(error.message === "Car does not exists!") {
        throw new AppError(error.message, HttpStatusCode.NO_CONTENT);
      }

      throw new AppError(error.message);
    }
  }
}
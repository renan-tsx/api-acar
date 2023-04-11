import { AppError } from "@shared/errors/AppError";
import HttpStatusCode from "@shared/errors/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

export class CreateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {

    try {
      const { car_id, expected_return_date } = request.body;
      const { id } = request.user;
  
      const createRentalUseCase = container.resolve(CreateRentalUseCase);
  
      const rental = await createRentalUseCase.execute({ 
        user_id: id,
        car_id,
        expected_return_date
      });
  
      return response.status(HttpStatusCode.CREATED).json(rental);
      
    } catch (error) {
      if(error.message === "Car is unavailable!") {
        throw new AppError(error.message, HttpStatusCode.CONFLICT);
      }

      if(error.message === "There`s a rental in progress for user!") {
        throw new AppError(error.message, HttpStatusCode.CONFLICT);
      }

      throw new Error(error.message);
    }
  }
}
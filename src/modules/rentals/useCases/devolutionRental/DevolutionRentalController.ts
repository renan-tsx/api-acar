import { AppError } from "@shared/errors/AppError";
import HttpStatusCode from "@shared/errors/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { DevolutionRentalUseCase } from "./DevolutionRentalUseCase";

export class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {

    try {
      const { id: user_id } = request.user;
      const { id } = request.params;
  
      const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);
  
      const rental = await devolutionRentalUseCase.execute({
        id,
        user_id
      });
  
      return response.status(200).json(rental);
      
    } catch (error) {
      if(error.message === "Rental does not exists!") {
        throw new AppError(error.message, HttpStatusCode.NO_CONTENT);
      }

      console.log("error", error.message)

      if(error.message.includes("invalid input syntax for type uuid")) {
        throw new AppError("Invalid input syntax for type uuid!", HttpStatusCode.BAD_REQUEST);
      }

      throw new AppError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }
}
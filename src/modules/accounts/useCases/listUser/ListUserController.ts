import { AppError } from "@shared/errors/AppError";
import HttpStatusCode from "@shared/errors/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUserUseCase } from "./ListUserUseCase";


class ListUserController {

  async handle(request: Request, response: Response): Promise<Response> {

    try {
      const { id } = request.user;
      const listUserUseCase = container.resolve(ListUserUseCase);

      const users = await listUserUseCase.execute(id);

      return response.status(HttpStatusCode.OK).json(users);

    } catch (error) {

      if(error.message === "No existing users!") {
        throw new AppError(error.message, HttpStatusCode.NO_CONTENT);
      }

      throw new Error(error.message);
    }
  }
}

export { ListUserController };

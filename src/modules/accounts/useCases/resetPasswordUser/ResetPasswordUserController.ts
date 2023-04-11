import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUseCase } from "./ResetPasswordUserUseCase";

export class ResetPassWordUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetPassWordUserUseCase = container.resolve(ResetPasswordUseCase);
    
    await resetPassWordUserUseCase.execute({ token: String(token), password});

    return response.send();
  }
}
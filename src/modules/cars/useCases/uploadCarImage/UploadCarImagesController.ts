import { AppError } from "@shared/errors/AppError";
import HttpStatusCode from "@shared/errors/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { UploadCarImageUseCase } from "./UploadCarImagesUseCase";

interface IFile {
  filename: string;
}

export class UploadCarImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const images = request.files as IFile[];
  
      const uploadCarImageUseCase = container.resolve(UploadCarImageUseCase);
  
      const images_name = images.map(file => file.filename);
  
      const res = await uploadCarImageUseCase.execute({
        car_id: id,
        images_name
      });
  
      return response.status(200).json(res);

    } catch (error) {

      if(error.message === "Car not found or invalid car id!") {
        throw new AppError(error.message, HttpStatusCode.NOT_FOUND);
      }

      throw new Error(error.message);
    }
  }
}
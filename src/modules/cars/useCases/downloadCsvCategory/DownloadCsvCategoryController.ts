import { AppError } from "@shared/errors/AppError";
import HttpStatusCode from "@shared/errors/HttpStatusCode";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { DownloadCsvCategoryUseCase } from "./DownloadCsvCategoryUseCase";

/** NOTE TSyringe
 * 
 * container.resolve() é usado para resolver (ou instanciar) a classe passada 
 * como parâmetro através do container.
 */

class DownloadCsvCategoryController {

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const downloadCsvCategoryUseCase = container.resolve(DownloadCsvCategoryUseCase);
      const csv = await downloadCsvCategoryUseCase.execute();
      
      response.set({
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=model_import_category.csv"
      })
      
      response.send(csv);

    } catch (error) {
      throw new AppError("Internal server error", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }
}

export { DownloadCsvCategoryController };

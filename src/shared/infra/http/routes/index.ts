import { NextFunction, Request, Response, Router } from "express";
import { authenticateRoutes } from "./authenticate.routes";

import { carsRoutes } from "./cars.routes";
import { categoriesRoutes } from "./categories.routes";
import { passwordRoutes } from "./password.routes";
import { rentalRouter } from "./rental.route";
import { specificationsRoutes } from "./specifications.routes";
import { usersRoutes } from "./users.routes";

function teste(request: Request, response: Response, next: NextFunction) {
  console.log(request.method)
  next()
}

const router = Router();

router.use(authenticateRoutes);

router.use("/categories", categoriesRoutes);
router.use("/specifications", specificationsRoutes);
router.use("/users", usersRoutes);
router.use("/cars", carsRoutes);
router.use("/rentals", rentalRouter);
router.use("/password", passwordRoutes);

export { router };

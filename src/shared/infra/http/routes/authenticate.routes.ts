import { AuthenticateUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";
import { Router } from "express";


const authenticateRoutes = Router();

/** NOTE TSyringe
 * 
 * Ao utilizar a injeção de dependência com TSyringe, mudamos a forma como 
 * lidamos com as rotas, permitindo passar o controlador como um middleware. 
 * Isso permite que as dependências sejam resolvidas automaticamente e fornece 
 * uma maneira mais flexível e escalável de lidar com a lógica de negócios.
 */

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post("/sessions", authenticateUserController.handle);
authenticateRoutes.post("/refresh-token", refreshTokenController.handle);

export { authenticateRoutes };

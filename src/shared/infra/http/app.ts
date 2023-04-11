import express from "express";
import "express-async-errors";

import "reflect-metadata";

import "dotenv/config";

import swaggerUi from "swagger-ui-express";

import swaggwerFile from "../../../swagger.json";

import { router } from "./routes";

import createConnection from "../typeorm";

/** NOTE TSyringe
 * 
 * Importar o container permite instanciá-lo e acessar os repositórios facilmente, 
 * sem precisar se preocupar com a criação das instâncias.
 * Isso facilita a escalabilidade e manutenção do código.
 */

import upload from "@config/upload";
import "@shared/container";
import { handleErrorHTTP } from "./middlewares/handleErrorHTTP";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggwerFile));

app.get("/healthcheck", (request, response) => response.status(200).send('OK'));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(router);

app.use(handleErrorHTTP);

export { app };

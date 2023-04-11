// 1 - Criar conexão com banco
import createConnection from "../src/shared/infra/typeorm/index";

createConnection('localhost').then(async (connection) => {
  await connection.dropDatabase();
  console.log("Banco de dados apagado com sucesso!");
}).catch((error) => console.log(error));

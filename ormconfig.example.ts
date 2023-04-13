import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const path = process.env.disk === "local" ? "src" : "dist"
const extension = process.env.disk === "local" ? "*.ts" : "*.js"

const ormconfig = {
  "type": "postgres",
  "host": "localhost",
  "port": parseInt(process.env.PORT_DOCKER),
  "username": process.env.POSTGRES_USER,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DB,
  "entities": [`./${path}/modules/**/entities/${extension}`],
  "migrations":  [`./${path}/shared/infra/typeorm/migrations/${extension}`],
  "cli": {
    "migrationsDir": `./${path}/shared/infra/typeorm/migrations/`
  }
}

const json = JSON.stringify(ormconfig, null, 2);

fs.writeFile('ormconfig.json', json, (err) => {
  err
    ? console.error('Erro ao gerar ormconfig.json: ' + err)
    : console.log('Gerado ormconfig.json')
}); 
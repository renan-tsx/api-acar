import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const path = process.env.DISK === "local" ? "src" : "dist"
const extension = process.env.DISK === "local" ? "*.ts" : "*.js"
const port = process.env.DISK === "local" ? process.env.PORT_DOCKER : process.env.PORT_HOST

const ormconfig = {
  "type": "postgres",
  "host": "localhost",
  "port": parseInt(port),
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

fs.writeFile('ormconfig.json', json, { flag: 'w' }, (err) => {
  err
    ? console.error('Erro ao gerar ormconfig.json: ' + err)
    : console.log('Gerado ormconfig.json')
}); 
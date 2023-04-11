import request from "supertest";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";
import { Connection } from "typeorm";

import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

let connection: Connection;

describe("Criar CategoryController", () => {

  beforeAll(async () => {
    connection = await createConnection();

    const query = "SELECT datname FROM pg_database WHERE datname='acar_test';"
    const dataBaseExists = await connection.query(query);
    
    if(dataBaseExists.length === 0) {
      await connection.query("CREATE DATABASE acar_test");
    }

    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash("admin", 8);

    const values = {
      id,
      name: 'admin', 
      email: 'admin@email.com',
      password, 
      is_admin: true,
      driver_license: 'XYZ-0000',
      created_at: () => 'now()'
    }

    await connection.createQueryBuilder()
      .insert()
      .into('users')
      .values(values)
      .execute()
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Deve ser capaz de criar uma nova categoria", async() => {
    const responseToken = await request(app).post("/sessions")
      .send({
        email: "admin@email.com",
        password: "admin"
      });

    const resposnse = await request(app)
      .post("/categories")
      .send({
        name: "Name category supertest",
        description: "Description category supertest"
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`
      });

    expect(resposnse.status).toBe(201);
  });
  
});
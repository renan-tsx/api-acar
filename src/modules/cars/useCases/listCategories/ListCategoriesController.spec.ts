import request from "supertest";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";
import { Connection } from "typeorm";

import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

let connection: Connection;

describe("Listar categorias controller", () => {

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

  it("Deve ser capaz de listar todas as categorias", async() => {
    const responseToken = await request(app).post("/sessions")
      .send({
        email: "admin@email.com",
        password: "admin"
      });

    const resNewCategory = await request(app)
      .post("/categories")
      .send({
        name: "Name category supertest",
        description: "Description category supertest"
      })
      .set({Authorization: `Bearer ${responseToken.body.token}`});

    expect(resNewCategory.status).toBe(201);

    const resCategories = await request(app)
      .get("/categories")
      .set({ Authorization: `Bearer ${responseToken.body.token}`});

    expect(resCategories.status).toBe(200);
    expect(resCategories.body.length).toBe(1);
    expect(resCategories.body[0]).toHaveProperty("id");
    expect(resCategories.body[0].name).toEqual("Name category supertest");
  });

});
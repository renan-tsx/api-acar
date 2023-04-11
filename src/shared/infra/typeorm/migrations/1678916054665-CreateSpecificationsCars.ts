import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSpecificationsCars1678916054665 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "specifications_cars",
                columns: [
                    {
                        name: "car_id",
                        type: "uuid"
                    },
                    {
                        name: "specification_id",
                        type: "uuid"
                    },
                    {
                        name:  "created_at",
                        type: "timestamp",
                        default: "now()",
                    }
                ]
            })
        )

        // Alternativa para criar ForeignKey

        await queryRunner.createForeignKey(
            "specifications_cars",
            new TableForeignKey({
                name: "FKSpecificarionCar",
                referencedTableName: "specifications",
                referencedColumnNames: ["id"],
                columnNames: ["specification_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        )

        await queryRunner.createForeignKey(
            "specifications_cars",
            new TableForeignKey({
                name: "FKCarSpecificarion",
                referencedTableName: "cars",
                referencedColumnNames: ["id"],
                columnNames: ["car_id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL",
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // Note que neste contexto o drop é o reverso da criação
        // A primeira tabela criada é a última a ser desfeita
        // A última tabela criada é a primeira a ser desfeita

        await queryRunner.dropForeignKey(
            "specifications_cars", "FKCarSpecificarion"
        )

        await queryRunner.dropForeignKey(
            "specifications_cars", "FKSpecificarionCar"
        )

        await queryRunner.dropTable("specifications_cars");
    }
}

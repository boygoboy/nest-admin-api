import { MigrationInterface, QueryRunner } from "typeorm";
import { readSqlFromFile } from '../utils/index';

export class Data1719296917800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const data = await readSqlFromFile('src/migrations/data.sql')
        for (const sql of data) {
            await queryRunner.query(sql)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}

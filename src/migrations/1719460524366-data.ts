import { MigrationInterface, QueryRunner } from "typeorm";
import { readSqlFromFile } from '../utils/index';
import { IS_DEV } from "@/config";


export class Data1719460524366 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const data = await readSqlFromFile(IS_DEV ? 'src/db/init.sql' : 'db/init.sql')
        for (const sql of data) {
            await queryRunner.query(sql)
        }
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
